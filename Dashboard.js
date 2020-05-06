
/*------ Affichage de la carte par defaut ------*/

showTab('_maps');
$('.speedUnits').text('km/h');
$('.distanceUnits').text('km');
$('.noCruiseControl').show();

function DashboardCompute(data) {

    // Logic consistent between ETS2 and ATS
    data.truckSpeedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));

    data.currentFuelPercentage = (data.truck.fuel / data.truck.fuelCapacity) * 100;
    data.scsTruckDamage = getDamagePercentage(data);
    data.scsTruckDamageRounded = Math.floor(data.scsTruckDamage);
    data.wearTrailerRounded = Math.floor(data.trailer.wear * 100);
    data.wearCargoRounded = Math.floor(data.cargo.wear * 100);
    var tons = (data.trailer.mass / 1000.0).toFixed(2);
    if (tons.substr(tons.length - 2) === "00") {
        tons = parseInt(tons);
    }
    data.trailerMassTons = data.trailer.attached ? (tons + ' t') : '';

    data.jobIncome = getEts2JobIncome(data.job.income);


    // return changed data to the core for rendering
    return data;
}


/*--- Affichage des info mission ---*/
function DashboardRender(data) {

    // data - same data object as in the filter function
    $('.fillingIcon.truckDamage .top').css('height', (100 - data.scsTruckDamage) + '%');
    $('.fillingIcon.fuel .top').css('height', (100 - data.currentFuelPercentage) + '%');

    $('.truckSpeedRoundedKmhMph').text(data.truckSpeedRounded);
    $('.game-time').text(selectedPlayer);
    $('.scsTruckDamageRounded').text(data.scsTruckDamageRounded);

    // Process DOM for job
    if (data.trailer.attached) {
		$('.fillingIcon.trailerDamage .top').css('height', (100 - data.trailer.wear * 100) + '%');
		$('.fillingIcon.cargoDamage .top').css('height', (100 - data.cargo.wear * 100) + '%');
		$('.wearTrailerRounded').text(data.wearTrailerRounded);
		$('.wearCargoRounded').text(data.wearCargoRounded);
		$('.trailer-name').text('poisson');
		$('.trailerMassKgOrT').text(data.trailerMassTons);
		$('.job-destinationCity').text(data.job.destCity);
		$('.job-destinationCompany').text(data.job.destCompany);
		$('.jobIncome').text(data.jobIncome);
        $('.hasJob').show();
        $('.noJob').hide();
    } else {
		$('.fillingIcon.trailerDamage .top').css('height', 100 + '%');
		$('.fillingIcon.cargoDamage .top').css('height', 100 + '%');
		$('.wearTrailerRounded').text("");
		$('.wearCargoRounded').text("");
        $('.hasJob').hide();
        $('.noJob').show();
    }

    // Set the current game attribute for any properties that are game-specific
    // $('.game-specific').attr('data-game-name', data.game.gameName);

    return data;
}



/*---- Mise en forme des revenues de la mission ----*/
function getEts2JobIncome(income) {

    var code = buildCurrencyCode(1, '', '€', '');

    return formatIncome(income, code);
}

function buildCurrencyCode(multiplier, symbolOne, symbolTwo, symbolThree) {
    return {
        "multiplier": multiplier,
        "symbolOne": symbolOne,
        "symbolTwo": symbolTwo,
        "symbolThree": symbolThree
    };
}

function formatIncome(income, currencyCode) {
    /* Taken directly from economy_data.sii:
          - {0} First prefix (no currency codes currently use this)
          - {1} Second prefix (such as euro, pound, dollar, etc)
          - {2} The actual income, already converted into the proper currency
          - {3} Third prefix (such as CHF, Ft, or kr)
    */
    var incomeFormat = "{0}{1} {2} {3}";
    income *= currencyCode.multiplier;

    return incomeFormat.replace('{0}', currencyCode.symbolOne)
        .replace('{1}', currencyCode.symbolTwo)
        .replace('{2}', income)
        .replace('{3}', currencyCode.symbolThree);
}

/*--- calcul des pourcentage de degats du camion ---*/
function getDamagePercentage(data) {
    // Return the max value of all damage percentages.
    return Math.max(data.truck.wearEngine,
        data.truck.wearTransmission,
        data.truck.wearCabin,
        data.truck.wearChassis,
        data.truck.wearWheels) * 100;
}

/*--- affichage de la tab que l'on souhaite ---*/
function showTab(tabName) {

    if (tabName == "_cargo" || tabName == "_damage") {
        const playerId = document.getElementById("selectPlayer") ? $('#selectPlayer').text() : $('#playerSelector').val();
        console.log(playerId)
        if (playerId == "–-") {
			modal.style.display = "block";
            return;
        }
    }
    $('._active_tab').removeClass('_active_tab');
    $('#' + tabName).addClass('_active_tab');

    $('._active_tab_button').removeClass('_active_tab_button');
    $('#' + tabName + '_button').addClass('_active_tab_button');
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Wrapper function to set an item to local storage.
function setLocalStorageItem(key, value) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        localStorage.setItem(key, value);
    }
}

// Wrapper function to get an item from local storage, or default if local storage is not supported.
function getLocalStorageItem(key, defaultValue) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        return localStorage.getItem(key);
    }

    return defaultValue;
}

// Wrapper function to remove an item from local storage
function removeLocalStorageItem(key) {
    if (typeof (Storage) !== "undefined" && localStorage != null) {
        return localStorage.removeItem(key);
    }
}
