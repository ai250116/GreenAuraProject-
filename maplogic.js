function initMap() {
    // Default fallback position: UTHM Parit Raja campus if location sharing is blocked
    const defaultLocation = { lat: 1.8596, lng: 103.1197 }; 
    
    // Attempt to locate our layout boundary element inside charity.html
    const mapElement = document.getElementById("map-canvas");
    
    if (!mapElement) {
        console.error("Critical Layout Error: Element with ID 'map-canvas' was not detected on this page view.");
        return;
    }

    // Initialize map node instance centered on default coordinates
    const map = new google.maps.Map(mapElement, {
        zoom: 14,
        center: defaultLocation,
        mapTypeControl: true,
        streetViewControl: false
    });

    // Drop a fallback map marker at UTHM center point configuration
    let primaryMarker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Default Location Hub (UTHM Parit Raja)"
    });

    // Request client-side geographic browser lookup coordinates
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                
                // Remove the default marker and re-center focus onto user's location
                primaryMarker.setMap(null);
                map.setCenter(userPos);

                // Drop fresh user tracking flag marker
                new google.maps.Marker({
                    position: userPos,
                    map: map,
                    title: "Your True Location"
                });

                // Mock dynamic near-point charity node (offset roughly 600m away from user coordinate context)
                const mockCharityHubPos = { 
                    lat: userPos.lat + 0.005, 
                    lng: userPos.lng + 0.005 
                };

                new google.maps.Marker({
                    position: mockCharityHubPos,
                    map: map,
                    title: "GreenAura Sustainable Collection Point"
                });
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        handleLocationError(false);
    }
}

function handleLocationError(browserHasGeolocation) {
    console.warn(browserHasGeolocation 
        ? "Notification Service Status: Access denied by user permissions scheme. Defaulting to system fallback matrix." 
        : "Notification Service Status: System engine lacks support for physical geolocation lookups.");
}

// 🛡️ DOM SYNCHRONIZATION WRAPPER: Ensures execution triggers only after entire layout finishes loading
window.onload = function() {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        initMap();
    } else {
        console.error("Google Maps Platform Error: Script package library failed to download. Check your API key setup inside the HTML head container.");
    }
};