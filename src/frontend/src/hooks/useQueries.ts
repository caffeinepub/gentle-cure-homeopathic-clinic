import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  ConsultationType,
  Inquiry,
  InquiryStatus,
  PaymentStatus,
  ShoppingItem,
} from "../backend.d";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation<
    bigint,
    Error,
    {
      name: string;
      email: string;
      phone: string;
      country: string;
      condition: string;
      message: string;
    }
  >({
    mutationFn: async ({ name, email, phone, country, condition, message }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(
        name,
        email,
        phone,
        country,
        condition,
        message,
      );
    },
  });
}

export function useBookConsultation() {
  const { actor } = useActor();
  return useMutation<
    bigint,
    Error,
    {
      patientName: string;
      email: string;
      phone: string;
      consultationType: ConsultationType;
      preferredDate: string;
      stripeSessionId: string | null;
    }
  >({
    mutationFn: async ({
      patientName,
      email,
      phone,
      consultationType,
      preferredDate,
      stripeSessionId,
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookConsultation(
        patientName,
        email,
        phone,
        consultationType,
        preferredDate,
        stripeSessionId,
      );
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation<
    string,
    Error,
    { items: ShoppingItem[]; successUrl: string; cancelUrl: string }
  >({
    mutationFn: async ({ items, successUrl, cancelUrl }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useUpdateInquiryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: bigint; status: InquiryStatus }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInquiryStatus(id, status);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

export function useUpdateBookingPaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, { bookingId: bigint; status: PaymentStatus }>(
    {
      mutationFn: async ({ bookingId, status }) => {
        if (!actor) throw new Error("Not connected");
        return actor.updateBookingPaymentStatus(bookingId, status);
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
    },
  );
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteInquiry(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}
