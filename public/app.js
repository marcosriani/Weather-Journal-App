(function () {
  // Create a new date instance dynamically with JS
  let d = new Date();
  let newDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  // Getting Form information
  const submitButton = document.querySelector('#generate');
  const zip = document.querySelector('#zip');
  const textArea = document.querySelector('#feelings');

  //   Areas of the UI to be updated
  const dateArea = document.querySelector('#date');
  const tempArea = document.querySelector('#temp');
  const contentArea = document.querySelector('#content');

  // Container where the data will be updated on the UI
  const containerDiv = document.querySelector('#entryHolder');

  // WEATHER API
  const baseURL = 'http://api.openweathermap.org/data/2.5/weather?';
  const countryCode = 'US';
  const apiKey = '303443fb1055dd49d261c723b8c45327';

  zip.addEventListener('change', (event) => {
    if (event.target.value.length < 5) {
      alert('Zip Code incomplete');
    }
    if (isNaN(event.target.value)) {
      alert('Zip Code is a number');
    }
  });

  //   Update UI function
  const updateUI = async () => {
    const request = await fetch('/all');
    try {
      const returnedData = await request.json();

      const createWrapperElement = (title, elementClass) => {
        //   Wrapper div
        const divElement = document.createElement('div');
        const spanElement = document.createElement('span');

        // Adding class
        divElement.classList.add(elementClass);

        // Appending elements
        containerDiv.appendChild(divElement);
        divElement.innerHTML = title;
        divElement.appendChild(spanElement);

        return spanElement;
      };

      returnedData.data.forEach((dataItem) => {
        // Creating elements and appending content
        if (dataItem.temperature !== undefined) {
          createWrapperElement('Temperature: ', 'temperature').innerHTML =
            dataItem.temperature;
        }
        if (dataItem.currentDate !== undefined) {
          createWrapperElement('Date: ', 'date').innerHTML =
            dataItem.currentDate;
        }
        if (dataItem.userResponse !== undefined) {
          createWrapperElement('Feeling: ', 'content').innerHTML =
            dataItem.userResponse;
        }
      });

      //   reset form
      zip.value = '';
      textArea.value = '';
    } catch (error) {
      console.log('Update UI error', error);
    }
  };

  submitButton.addEventListener('click', (event) => {
    const textAreaContent = textArea.value;
    const zipCode = zip.value;

    if (zipCode === '') {
      alert('Enter a Zip Code');
    }

    event.preventDefault();

    containerDiv.innerHTML = '';
    // Get request
    const getWeather = async (baseURL, zipCode, countryCode, apiKey) => {
      const urlToFetch = `${baseURL}zip=${zipCode},${countryCode}&units=metric&appid=${apiKey}`;
      const response = await fetch(urlToFetch);
      try {
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('Error', error);
      }
    };

    // Post request
    const postData = async (url = '', data = {}) => {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      try {
        const newData = await response.json();
        return newData;
      } catch (error) {
        console.log('error', error);
      }
    };

    //   Chaining of Promises
    getWeather(baseURL, zipCode, countryCode, apiKey)
      .then((data) => {
        if (data.main !== undefined) {
          data.main.currentTime = newDate;
          data.main.userResponse = textAreaContent;
        } else {
          alert('Error, Please enter Zip Code');
        }

        postData('/database', data);
      })
      .then(() => {
        updateUI();
      });
  });

  window.onload = () => {
    updateUI();
  };
})();
