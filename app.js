$(document).ready(function() {
    
    const stats = ['Open', 'Completed', 'Open - Dup', 'Completed - Dup']
    window.test = 'suck ass'
    function hideScreens() {
        $(".content").hide();
        $('#navbarNav').collapse("hide")
    }

    function setStatusOptions() {
        for (stat of stats) {
            $('#statusInput').append(`<option value='${stat}'>${stat}</option>`)
        }
    }

    
    async function searchData(status, ward) {
        let queryString = ''
        status ? queryString += `&status=${status}` : null
        ward ? queryString += `&ward=${ward}` : null
        fetch(`https://data.cityofchicago.org/resource/hec5-y4x5.json?$limit=1000${queryString}`).then(data => data.json()).then(data => { 
            displayListResults(data)
            hideScreens()
            location.hash = '#listView'
            $('#listView').show()
            return data
        }).then(data => {
            setMapData(data)
        }).catch(data => console.log(data))
    }
    
    async function setMapData(items) {
        // console.log(items)
        window.mapData = items
        $('#searchForm')[0].reset()
    }

    async function displayListResults(items) {
        $('#resultsList').html(``)
        for ([i, item] of items.entries()) {
            $('#resultsList').append(`<a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-toggle="collapse" data-target="#res${i}">${item.street_address}<span class="d-none d-sm-inline-block">${item.what_type_of_surface_is_the_graffiti_on_}</span><span class="badge badge-primary badge-pill">${item.where_is_the_graffiti_located_}</span></a>
            
            <div id="res${i}" class="collapse" data-parent="#resultsList">
                <div class="card-body bg-light">
                    <div class="form-group row">
                        <label for="SRN" class="col col-form-label">Service Request #:</label>
                        <div class="col">
                            <input type="text" readonly class="form-control-plaintext" id="SRN" value="${item.service_request_number}">
                        </div>
                    </div>
                    <div class="form-group row d-sm-none">
                        <label for="surfaceType" class="col col-form-label">Type of Surface:</label>
                        <div class="col">
                            <input type="text" readonly class="form-control-plaintext" id="surfaceType" value="${item.what_type_of_surface_is_the_graffiti_on_}">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="dateCreated" class="col col-form-label">Date Created:</label>
                        <div class="col">
                            <input type="text" readonly class="form-control-plaintext text-truncate" id="dateCreated" value="${new Date(item.creation_date)}">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="status" class="col col-form-label">Status:</label>
                        <div class="col">
                            <input type="text" readonly class="form-control-plaintext" id="status" value="${item.status}">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="completionDate" class="col col-form-label">Completion Date:</label>
                        <div class="col">
                            <input type="text" readonly class="form-control-plaintext text-truncate" id="completionDate" value="${item.completion_date ? new Date(item.completion_date) : 'N/A'}">
                        </div>
                    </div>
                </div>
            </div>`)
        }
    }

    function hashHandler() {
        console.log('The hash has changed!')
        if (location.hash === '#home') {
            $('#footer').addClass('bottom-footer')
        } else { $('#footer').removeClass('bottom-footer') }
      }
      
      window.addEventListener('hashchange', hashHandler, false);

    $('#home').show()
    setStatusOptions()
    $(".nav-link").on("click", function(){
        if (this.id === 'btnAdd') {
            return
        }
        hideScreens();
        let target = $(this).attr("href");
        $(target).show();
    });
    $('.navbar-brand').on('click', () => {
        hideScreens();
        $('#home').show()

    })
    

    
    // event handler
    $("#searchForm").submit((e) => {
        e.preventDefault()
        let status = $('#statusInput').val()
        let ward = $('#WardInput').val()
        if (ward > 50) {
            ward = null
        }
        searchData(status, ward)
        
      });


      // PWA Prompt Handling
      let deferredPrompt;
      let btnAdd = document.querySelector('#btnAdd')
      window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can add to home screen
      btnAdd.style.display = 'block';
    });
    
    btnAdd.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      btnAdd.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
      

});
