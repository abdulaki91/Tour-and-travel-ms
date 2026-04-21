import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { packageService } from "../services/packages";
import { reviewService } from "../services/reviews";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Rating from "../components/ui/Rating";
import Modal from "../components/ui/Modal";
import BookingForm from "../components/BookingForm";

const PackageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: packageData, isLoading: packageLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => packageService.getPackage(Number(id)),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["package-reviews", id],
    queryFn: () => reviewService.getPackageReviews(Number(id), { limit: 5 }),
    enabled: !!id,
  });

  if (packageLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!packageData?.success || !packageData.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Package Not Found
          </h1>
          <Button onClick={() => navigate("/packages")}>
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const pkg = packageData.data;
  const reviews = reviewsData?.data.items || [];

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <span
            className="hover:text-indigo-600 cursor-pointer"
            onClick={() => navigate("/packages")}
          >
            Packages
          </span>
          <span className="mx-2">/</span>
          <span>{pkg.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pkg.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-1" />
                <span>{pkg.location}</span>
              </div>
              <div className="flex items-center">
                <Rating
                  value={pkg.average_rating}
                  readonly
                  size="sm"
                  showValue
                />
                <span className="ml-1">({pkg.review_count} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              ${pkg.price}
            </div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          {pkg.images && pkg.images.length > 0 && (
            <div className="mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <img
                  src={pkg.images[selectedImageIndex]}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {pkg.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {pkg.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 rounded-lg overflow-hidden ${
                        selectedImageIndex === index
                          ? "ring-2 ring-indigo-500"
                          : ""
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${pkg.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Package
            </h2>
            <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Package Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{pkg.duration_days} days</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Max {pkg.max_people} people</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span>
                    {new Date(pkg.start_date).toLocaleDateString()} -{" "}
                    {new Date(pkg.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Availability
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Available Slots</span>
                  <div className="text-lg font-semibold">
                    {pkg.available_slots} remaining
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Company</span>
                  <div className="font-medium">{pkg.company_name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Includes/Excludes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {pkg.includes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Included
                </h3>
                <div className="space-y-2">
                  {pkg.includes.split("\n").map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pkg.excludes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What's Not Included
                </h3>
                <div className="space-y-2">
                  {pkg.excludes.split("\n").map((item, index) => (
                    <div key={index} className="flex items-start">
                      <XMarkIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Itinerary */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Itinerary
              </h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-indigo-500 pl-6 pb-6"
                  >
                    <div className="flex items-center mb-2">
                      <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold -ml-10 mr-4">
                        {day.day}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {day.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-2">{day.description}</p>
                    {day.activities && day.activities.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
            {reviewsLoading ? (
              <LoadingSpinner />
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {review.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Rating value={review.rating} readonly size="sm" />
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to review this package!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                ${pkg.price}
              </div>
              <div className="text-gray-500">per person</div>
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleBookNow}
              disabled={pkg.available_slots === 0}
              className="mb-4"
            >
              {pkg.available_slots === 0 ? "Fully Booked" : "Book Now"}
            </Button>

            <div className="text-center text-sm text-gray-500 mb-4">
              Free cancellation up to 24 hours before
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{pkg.duration_days} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Group Size:</span>
                  <span>{pkg.max_people} people</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Slots:</span>
                  <span>{pkg.available_slots}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book This Package"
        size="lg"
      >
        <BookingForm
          package={pkg}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate("/user/bookings");
          }}
          onCancel={() => setShowBookingModal(false)}
        />
      </Modal>
    </div>
  );
};

export default PackageDetailsPage;
