import googlemaps
import os

from typing import Optional, TypedDict

gmaps = googlemaps.Client(key=os.environ.get("GOOGLE_MAPS_API_KEY"))


class AddressDict(TypedDict):
    address_1: str
    address_2: Optional[str]
    city: str
    state: str
    zip_code: str


class Address:
    def __init__(self, **kwargs: AddressDict):
        self.__dict__.update(kwargs)

    def format_address_string(self):
        address = self.address_1

        if self.address_2:
            address += f", {self.address_2}"
        address += f", {self.city}, {self.state} {self.zip_code}"
        return address

    def geocode_lat_lng(self):
        result = gmaps.geocode(self.format_address_string())

        return (
            result[0]["geometry"]["location"]["lat"],
            result[0]["geometry"]["location"]["lng"],
        )
