import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Package } from "../types";
import { bookingService } from "../services/bookings";
import type { CreateBookingData } from "../services/bookings";
import Button from "./ui/Button";
import Input from "./ui/Input";

const bookingSchema = z.object({
  number_of_people: z
    .number()
    .min(1, "At least 1 person required")
    .max(50, "Maximum 50 people allowed"),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  package: Package;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  package: pkg,
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<"booking" | "payment">("booking");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      number_of_people: 1,
    },
  });

  const numberOfPeople = watch("number_of_people");
  const totalAmount = numberOfPeople * pkg.price;

  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingData) => bookingService.createBooking(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Booking created successfully!");
        onSuccess();
      } else {
        toast.error(response.message || "Failed to create booking");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (step === "booking") {
      setStep("payment");
      return;
    }

    // Create booking using fixed package start_date
    createBookingMutation.mutate({
      package_id: pkg.id,
      booking_date: pkg.start_date,
      number_of_people: data.number_of_people,
      special_requests: data.special_requests,
    });
  };

  if (step === "payment") {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-medium">{pkg.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Tour Dates:</span>
              <span className="text-primary-600 font-medium">
                {new Date(pkg.start_date).toLocaleDateString()} -{" "}
                {new Date(pkg.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Number of People:</span>
              <span>{numberOfPeople}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per Person:</span>
              <span>${pkg.price}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>${totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            Payment Information
          </h4>
          <p className="text-blue-700 text-sm">
            This is a demo booking system. In a real application, you would
            integrate with a payment processor like Stripe, PayPal, or similar
            service.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep("booking")}
            disabled={createBookingMutation.isPending}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={createBookingMutation.isPending}
            className="flex-1"
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{pkg.title}</h3>
        <div className="text-sm text-gray-600">
          <p>
            {pkg.location} • {pkg.duration_days} days
          </p>
          <div className="mt-2 p-2 bg-primary-50 rounded border border-primary-100 text-primary-700">
            <p className="font-semibold">Fixed Tour Dates:</p>
            <p>
              {new Date(pkg.start_date).toLocaleDateString()} to{" "}
              {new Date(pkg.end_date).toLocaleDateString()}
            </p>
          </div>
          <p className="mt-2 text-lg font-bold text-gray-900">
            ${pkg.price} <span className="text-sm font-normal text-gray-500">per person</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Number of People"
          type="number"
          {...register("number_of_people", { valueAsNumber: true })}
          error={errors.number_of_people?.message}
          min={1}
          max={Math.min(pkg.max_people, pkg.available_slots)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Requests (Optional)
        </label>
        <textarea
          {...register("special_requests")}
          rows={3}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Any special requirements or requests..."
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-primary-600">
            ${totalAmount}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          For {numberOfPeople} person{numberOfPeople !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
