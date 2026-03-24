import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import OutCall "http-outcalls/outcall";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type InquiryStatus = { #new; #contacted; #converted };
  type PaymentStatus = { #pending; #paid; #failed };

  public type Inquiry = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    country : Text;
    condition : Text;
    message : Text;
    timestamp : Int;
    status : InquiryStatus;
  };

  public type ConsultationType = {
    #online;
    #inPerson;
  };

  public type Booking = {
    id : Nat;
    patientName : Text;
    email : Text;
    phone : Text;
    consultationType : ConsultationType;
    preferredDate : Text;
    paymentStatus : PaymentStatus;
    stripeSessionId : ?Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // Compare functions
  func compareInquiry(a : Inquiry, b : Inquiry) : Order.Order {
    Nat.compare(a.id, b.id);
  };

  func compareBooking(a : Booking, b : Booking) : Order.Order {
    Nat.compare(a.id, b.id);
  };

  // State
  let inquiries = Map.empty<Nat, Inquiry>();
  let bookings = Map.empty<Nat, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var inquiryIdCounter = 0;
  var bookingIdCounter = 0;

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Inquiry Functions
  // Anyone can submit an inquiry (guests, users, admins)
  public shared ({ caller }) func submitInquiry(name : Text, email : Text, phone : Text, country : Text, condition : Text, message : Text) : async Nat {
    let id = inquiryIdCounter;
    let inquiry : Inquiry = {
      id;
      name;
      email;
      phone;
      country;
      condition;
      message;
      timestamp = Time.now();
      status = #new;
    };

    inquiries.add(id, inquiry);
    inquiryIdCounter += 1;
    id;
  };

  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    inquiries.values().toArray().sort(compareInquiry);
  };

  public shared ({ caller }) func updateInquiryStatus(id : Nat, newStatus : InquiryStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiry) {
        let updatedInquiry : Inquiry = { inquiry with status = newStatus };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  public shared ({ caller }) func deleteInquiry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not inquiries.containsKey(id)) {
      Runtime.trap("Inquiry not found. Inquiry " # id.toText() # " does not exist.");
    };
    inquiries.remove(id);
  };

  // Booking Functions
  // Anyone can book a consultation (guests, users, admins)
  public shared ({ caller }) func bookConsultation(patientName : Text, email : Text, phone : Text, consultationType : ConsultationType, preferredDate : Text, stripeSessionId : ?Text) : async Nat {
    let id = bookingIdCounter;
    let booking : Booking = {
      id;
      patientName;
      email;
      phone;
      consultationType;
      preferredDate;
      paymentStatus = #pending;
      stripeSessionId;
      timestamp = Time.now();
    };

    bookings.add(id, booking);
    bookingIdCounter += 1;
    id;
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    bookings.values().toArray().sort(compareBooking);
  };

  public shared ({ caller }) func updateBookingPaymentStatus(bookingId : Nat, newStatus : PaymentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = { booking with paymentStatus = newStatus };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // Stripe Configuration and Payment Functions
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  // Anyone can check session status (guests, users, admins)
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Anyone can create a checkout session (guests, users, admins)
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
