import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Booking {
    id: bigint;
    paymentStatus: PaymentStatus;
    email: string;
    preferredDate: string;
    timestamp: bigint;
    patientName: string;
    phone: string;
    stripeSessionId?: string;
    consultationType: ConsultationType;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Inquiry {
    id: bigint;
    status: InquiryStatus;
    country: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
    condition: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum ConsultationType {
    inPerson = "inPerson",
    online = "online"
}
export enum InquiryStatus {
    new_ = "new",
    contacted = "contacted",
    converted = "converted"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookConsultation(patientName: string, email: string, phone: string, consultationType: ConsultationType, preferredDate: string, stripeSessionId: string | null): Promise<bigint>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteInquiry(id: bigint): Promise<void>;
    getBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiries(): Promise<Array<Inquiry>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitInquiry(name: string, email: string, phone: string, country: string, condition: string, message: string): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBookingPaymentStatus(bookingId: bigint, newStatus: PaymentStatus): Promise<void>;
    updateInquiryStatus(id: bigint, newStatus: InquiryStatus): Promise<void>;
}
