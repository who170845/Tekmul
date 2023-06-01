import {geolib, getDistance} from "geolib"

    async function getCurrentLocation() {
      console.log("tes");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            showMap(latitude, longitude);
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    function showMap(latitude, longitude){
      console.log(latitude, longitude);
    };

    // async function getCoordinat() {
    //   navigator.geolocation.getCurrentPosition(
    //       position => {
    //         //console.log(position.coords.latitude);
    //         //console.log(position.coords.longitude);
    //         const latitude = position.coords.latitude;
    //         const longitude = position.coords.longitude;
    //         //const latitude = -7.293861;
    //         //const longitude = 112.799249;
    //         return (latitude, longitude)
    //       },
    //       error => {
    //         console.log(error.message);
    //       },
    //   )
    // }
    async function getCoordinat() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              resolve({ latitude, longitude });
            },
            error => {
              reject(error.message);
            }
          );
        });
      }
      

    function calculateDistance() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(
                'You are ',
                geolib.getDistance(position.coords, {
                    latitude: 51.525,
                    longitude: 7.4575,
                }),
                'meters away from 51.525, 7.4575'
            );
        },
        () => {
            alert('Position could not be determined.');
        });
    }

    // function countDistance(latNow, longNow, latDest, longDest){
    //   const hasil = getDistance(
    //     { latitude: -7.289970, longitude:  112.797507 },
    //     { latitude: latDest, longitude: longDest }
    //   );
    //   console.log(hasil);
    //   return hasil
    // }
    function countDistance(latNow, longNow, latDest, longDest) {
      return new Promise((resolve, reject) => {
        // Melakukan perhitungan jarak
        const hasil = getDistance(
              { latitude: latNow, longitude:  longNow },
              { latitude: latDest, longitude: longDest }
            );
    
        if (hasil) {
          resolve(hasil); // Mengembalikan hasil perhitungan
        } else {
          reject(new Error("Gagal menghitung jarak")); // Menolak Promise dengan kesalahan
        }
      });
    }

export {countDistance, getCoordinat}