// components/AutocompleteAddress.js
import { Input } from "@chakra-ui/react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useRef } from "react";

const AutocompleteAddress = ({ onPlaceSelected, placeholder }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAtb9jMVA-itMHurbYOJlIVpxpkyP7YEgE',
    libraries: ['places'],
  });

  const autocompleteRef = useRef(null);

  if (!isLoaded) return <Input placeholder={placeholder} disabled />;

  return (
    <Input
      placeholder={placeholder}
      ref={autocompleteRef}
      onFocus={() => {
        const autocomplete = new window.google.maps.places.Autocomplete(
          autocompleteRef.current
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          onPlaceSelected(place);
        });
      }}
    />
  );
};

export default AutocompleteAddress;
