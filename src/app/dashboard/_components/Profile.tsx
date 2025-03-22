import { Badge } from "@/components/ui/badge"; // ShadCN Badge component for tags
import { Mail, Phone, MapPin, Link2, Salad, Pizza, UsersRound, Instagram } from "lucide-react"; // Icons for contact info
import Image from "next/image"; // For optimized image

// Define a type for restaurant info
type RestaurantInfo = {
  logo: string;
  name: string;
  description: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
    instagram: string;
  };
};

export default function Profile() {
  // Consolidate all information in a single object
  const restaurantInfo: RestaurantInfo = {
    logo: "/local.jpg", // Replace with actual logo image path
    name: "CorzettiSF",
    description: "A contemporary Italian eatery in San Francisco, known for fresh, handmade pasta and a refined menu of local ingredients.",
    contact: {
      email: "contact@corzettisf.com",
      phone: "(+1-415) 555-1234", // Placeholder number, update as necessary
      location: "San Francisco, CA",
      website: "https://www.corzettisf.com",
      instagram: "https://www.instagram.com/corzettisf/",
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 space-y-6">
      {/* Logo Section */}
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-2">
          <Image
            src={restaurantInfo.logo} // Using object for logo
            alt="Restaurant Logo"
            width={80}
            height={80}
            className="object-cover rounded-full"
          />
        </div>
        <div className="font-bold text-sm">{restaurantInfo.name}</div> {/* Using object for name */}
      </div>

      {/* Restaurant Information Section */}
      <div className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Restaurant Description</p>
          <p className="text-gray-600 text-sm">{restaurantInfo.description}</p> {/* Using object for description */}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Tags</p>
          <div className="flex space-x-2">
            <Badge variant="outline" className="flex items-center text-sm">
              <Pizza className="h-4 w-4 mr-1" />
              Italian
            </Badge>
            <Badge variant="outline" className="flex items-center text-sm">
              <Salad className="h-4 w-4 mr-1" />
              Vegetarian
            </Badge>
            <Badge variant="outline" className="flex items-center text-sm">
              <UsersRound className="h-4 w-4 mr-1" />
              Family-friendly
            </Badge>
          </div>
        </div>

        {/* Location and Contact Info */}
        <div className="flex flex-col gap-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="text-primary h-4 w-4" />
            <p className="text-gray-600 text-sm">{restaurantInfo.contact.email}</p> {/* Using object for email */}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone className="text-primary h-4 w-4" />
            <p className="text-gray-600 text-sm">{restaurantInfo.contact.phone}</p> {/* Using object for phone */}
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="text-primary h-4 w-4" />
            <p className="text-gray-600 text-sm">{restaurantInfo.contact.location}</p> {/* Using object for location */}
          </div>

          {/* Website */}
          <div className="flex items-center gap-3">
            <Instagram className="text-primary h-4 w-4" />
            <a href={restaurantInfo.contact.instagram} className="hover:underline text-sm" target="_blank">
              {restaurantInfo.name.toLowerCase()} {/* Using object for website */}
            </a>
          </div>

          {/* Website */}
          <div className="flex items-center gap-3">
            <Link2 className="text-primary h-4 w-4" />
            <a href={restaurantInfo.contact.website} className="hover:underline text-sm" target="_blank">
              {restaurantInfo.contact.website} {/* Using object for website */}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
