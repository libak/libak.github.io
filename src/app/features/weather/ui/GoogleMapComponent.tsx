import React, { useEffect } from 'react';

const GoogleMapComponent: React.FC = () => {
    useEffect(() => {
        // Load the Google Maps API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly`;
        script.defer = true;
        document.head.appendChild(script);

        // Initialize the map once the script is loaded
        (window as any).initMap = () => {
            new google.maps.Map(document.getElementById('map') as HTMLElement, {
                center: { lat: 62.323907, lng: -150.109291 },
                zoom: 11,
                mapTypeId: 'satellite',
            });
        };

        return () => {
            // Clean up the script and map initialization
            document.head.removeChild(script);
            delete (window as any).initMap;
        };
    }, []);

    return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMapComponent;