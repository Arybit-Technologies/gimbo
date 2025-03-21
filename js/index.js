/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
//document.addEventListener('deviceready', onDeviceReady, false);
var user_ID = generateDeviceId();
var username = "";
var email = "";
var password_hash = ""; 
var imgAddcount = 0;
var imgAdd_count = 0;
var imgDetect_count = 0;
var image_quality = 75;

var maessa_up_Arr = 'Right front,Left front,Right rear,Left rear,Chassis,Odometer,Engine number,Front interior,Rear interior,Windscreen,Boot lid,Radio,Dashboard,VIN plate,Number plate,Capture tyres,Logbook photo';
 
var action = "submitReport";
var inspect_action = "";
let timestamp;
let response_valuationForms;
let response_valuationTypes;
let response_industryTypes;
let response_requests;
let response_requestsVehicles;
let response_requestsReports;
let get_Location;

let responseReports = [];  // Initialize as an empty array
let responseValuationForms = [];  // Initialize as an empty array
let responseImages = [];  // Initialize as an empty array
let responseVehicles = [];  // Initialize as an empty array
let storageData = [];  // Initialize as an empty array
let response_inspections_requests_valuations = [];  // Initialize as an empty array

let response_assignments;
let response_recentActivity;

let response_valuerUsers;
let response_companyUsers;

let response_reports;
let response_images;
let valuationResult_images;

let response_vehicles; 
let companies; 
let companyDetails; 
let inspections_valuations; 

let teamChart;
let storageStatusChart;

let storage_server; 
//var server_Url = 'http://192.168.8.109/arybit/';
//var server_Url = 'https://treadstone-es.co.ke/api/';
//var server_Url = 'https://autovaluationpro.arybit.co.ke/api/';
//var server_Url = 'http://192.168.8.109/api/';
//var server_Url = 'https://arybit.co.ke/api/';
//var server_Url = 'http://localhost/api/';
//var urlValuator = 'http://localhost';
var urlValuator = 'https://autovaluationpro.arybit.co.ke';
var server_Url = '' + urlValuator + '/api/';

var vehicleValuatorData = "";
let approvalStatusChart = null;
let assignmentStatusChart = null;
let uploadedFiles = [];
let uploadedTimeFiles = [];
let uploadedVideoFiles = [];
let uploadedTimeVideoFiles = [];

let uploadedImageFile = [];

var role ="";
var uploadChunkedFileCount =0;
var uploadedFiles_evt_loaded =0;
var camera_toggle = 0;
var chunkFormDataCount = 0;

const carData = {
  "Acura": ["ILX", "MDX", "NSX", "RDX", "RLX", "TLX", "NSX Type R", "Integra", "NSX Type S", "RSX", "Legend", "Vigor", "CL"],
  "Alfa Romeo": ["4C", "Giulia", "Stelvio", "Spider", "Brera", "159", "8C Competizione", "4C Spider", "Alfetta", "Montreal", "6C", "GTV", "Sprint", "SZ"],
  "Aston Martin": ["DB11", "DBS Superleggera", "Vantage", "DBX", "Rapide", "Vanquish", "Virage", "Valkyrie", "DBS", "Lagonda", "Virage", "DB9", "One-77", "Lagonda Taraf"],
  "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "Q3", "Q5", "Q7", "Q8", "R8", "RS 3", "RS 5", "RS 6", "S3", "S4", "S5", "S6", "S7", "SQ5", "SQ7", "SQ8", "TT", "S8", "A1", "Q2", "RS 7", "S1", "S2"],
  "Bentley": ["Bentayga", "Continental GT", "Flying Spur", "Mulsanne", "Azure", "Brooklands", "Arnage", "Bentayga Speed", "Continental GT Convertible", "Brooklands Coupe", "Azure T"],
  "BMW": ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "M2", "M3", "M4", "M5", "M8", "i3", "i4", "i8", "X8", "iX3", "M6", "Z8", "X6 M", "X5 M"],
  "Buick": ["Cascada", "Encore", "Enclave", "Encore GX", "Envision", "LaCrosse", "Regal", "Verano", "Lucerne", "Rainier", "Terraza", "Roadmaster", "Park Avenue", "Reatta", "Wildcat", "Riviera", "Skyhawk"],
  "Cadillac": ["ATS", "CT4", "CT5", "CT6", "CTS", "Escalade", "Escalade ESV", "SRX", "XT4", "XT5", "XT6", "XTS", "ELR", "Allante", "Brougham", "XLR", "Fleetwood", "Seville", "XLR"],
  "Chevrolet": ["Blazer", "Bolt EV", "Camaro", "Colorado", "Equinox", "Express", "Impala", "Malibu", "Silverado", "Sonic", "Spark", "Suburban", "Tahoe", "Trailblazer", "Traverse", "Trax", "Nova", "Caprice", "Vega", "Monte Carlo", "Tracker", "Uplander", "Venture"],
  "Chrysler": ["200", "300", "Aspen", "Pacifica", "PT Cruiser", "Sebring", "Voyager", "Concorde", "LHS", "Crossfire", "Newport", "Royal", "TC by Maserati"],
  "Dodge": ["Avenger", "Caliber", "Caravan", "Challenger", "Charger", "Dart", "Durango", "Grand Caravan", "Journey", "Magnum", "Neon", "Nitro", "Ram Van", "Viper", "Stealth", "Coronet", "Shadow", "Spirit", "St. Regis"],
  "Ferrari": ["812 Superfast", "488 GTB", "California T", "F8 Tributo", "GTC4Lusso", "Portofino", "Roma", "SF90 Stradale", "LaFerrari", "458 Italia", "599 GTB Fiorano", "Enzo Ferrari", "Dino", "Testarossa", "288 GTO", "Mondial"],
  "Fiat": ["124 Spider", "500", "500L", "500X", "Bravo", "Panda", "Punto", "Tipo", "Croma", "Seicento", "Idea", "Uno", "Tempra", "Coupé", "Barchetta"],
  "Genesis": ["G70", "G80", "G90", "GV80", "G70 Shooting Brake", "GV70", "GV60"],
  "Jaguar": ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "S-Type", "XE", "XF", "XJ", "XK", "XKR", "XJ220", "Mark 2", "X-Type", "XKR-S", "XE SV Project 8"],
  "Lamborghini": ["Aventador", "Huracán", "Urus", "Murciélago", "Gallardo", "Diablo", "Countach", "Reventón", "Sesto Elemento", "Veneno", "Centenario"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "LR2", "LR4", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar", "Series I", "Series II", "Series III", "Freelander", "Range Rover Classic", "Series IV", "Discovery Vision Concept"],
  "Lexus": ["CT", "ES", "GS", "GX", "HS", "IS", "LC", "LFA", "LS", "LX", "NX", "RC", "RX", "UX", "SC", "HS 250h", "GS F", "RC F", "LF", "GX 460", "LX 570", "RC 300", "UX 250h"],
  "Lincoln": ["Aviator", "Continental", "Corsair", "MKZ", "Nautilus", "Navigator", "LS", "MKS", "Blackwood", "Mark VII"],
  "Lotus": ["Elan", "Esprit", "Evora", "Exige", "Europa", "Elise", "Seven", "Elise Cup", "Exige S", "Evora GT410 Sport", "Esprit V8"],
  "Maserati": ["Ghibli", "GranSport", "GranTurismo", "Levante", "Quattroporte", "Spyder", "Merak", "Bora", "Khamsin", "Mistral", "Quattroporte GTS"],
  "Mazda": ["CX-3", "CX-30", "CX-5", "CX-7", "CX-9", "Mazda2", "Mazda3", "Mazda5", "Mazda6", "MX-5 Miata", "RX-8", "Tribute", "Millenia", "MazdaSpeed3", "RX-7", "Millenia S", "MX-6"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CL-Class", "CLA-Class", "CLK-Class", "CLS-Class", "E-Class", "G-Class", "GL-Class", "GLA-Class", "GLB-Class", "GLC-Class", "GLK-Class", "M-Class", "R-Class", "S-Class", "SL-Class", "SLK-Class", "SLS AMG", "Sprinter", "GLS-Class", "EQC", "GLE-Class", "GLK-Class", "SLC-Class", "SLR McLaren", "AMG GT", "CLA Shooting Brake", "190", "260E", "500E", "560SEC", "300CE", "190E 2.5-16 Evolution II", "280CE", "400E", "450SLC", "300SE", "300SD", "450SEL", "300SEL", "380SEL", "280SE", "300SDL", "420SEL", "560SEL", "350SD", "350SDL", "380SEC", "380SEL", "500SEC", "500SEL", "300E 4MATIC", "190D", "260SE", "300SE 2.8", "400SE", "500SE", "500SEL 6.0 AMG", "190D 2.5", "300SD 2.5", "300SDL 2.5", "300E 3.2 AMG", "300CE 3.4 AMG", "500E 6.0 AMG", "C 111", "SLK 32 AMG", "CLK 63 AMG Black Series", "CLK DTM AMG", "C 63 AMG Black Series", "E 63 AMG Black Series", "SL 65 AMG Black Series"],
  "MINI": ["Clubman", "Cooper", "Countryman", "Hardtop", "Paceman", "Roadster", "Coupe", "Cabrio", "Countryman JCW", "Cooper S Clubman", "John Cooper Works GP"],
  "Mitsubishi": ["Eclipse", "Eclipse Cross", "Endeavor", "Galant", "Lancer", "Mighty Max", "Mirage", "Montero", "Outlander", "Raider", "3000GT", "3000GT VR-4", "Montero Sport", "Starion", "Eclipse Spyder"],
  "Nissan": ["200SX", "240SX", "300ZX", "350Z", "370Z", "Altima", "Armada", "Cube", "Frontier", "GT-R", "Juke", "Kicks", "Leaf", "Maxima", "Murano", "NV", "NV200", "NX", "Pathfinder", "Quest", "Rogue", "Rogue Sport", "Sentra", "Titan", "Versa", "Xterra", "2000GT", "300ZX Twin Turbo", "Pulsar", "240Z", "Titan XD"],
  "Pagani": ["Huayra", "Zonda", "Zonda Roadster", "Zonda F", "Zonda Cinque", "Zonda Tricolore", "Zonda R", "Huayra Roadster", "Huayra BC", "Zonda Revolucion"],
  "Porsche": ["911", "918 Spyder", "Boxster", "Carrera GT", "Cayenne", "Cayman", "Macan", "Panamera", "Taycan", "912", "924", "944", "959", "968", "911 GT2 RS", "914", "959", "Carrera 4S"],
  "RAM": ["1500", "2500", "3500", "4500", "5500", "ProMaster", "ProMaster City", "Dakota", "D50", "RAM 1500 TRX", "RAM 1200", "RAM ProMaster City Wagon"],
  "Renault": ["Captur", "Clio", "Duster", "Espace", "Fluence", "Kadjar", "Kangoo", "Koleos", "Laguna", "Latitude", "Logan", "Master", "Megane", "Modus", "Sandero", "Scenic", "Symbol", "Talisman", "Thalia", "Trafic", "Twingo", "Zoe", "Avantime", "Fuego", "Safrane", "Vel Satis", "Wind", "Alpine A110"],
  "Rolls-Royce": ["Cullinan", "Dawn", "Ghost", "Phantom", "Wraith", "Silver Ghost", "Silver Seraph", "Park Ward", "Camargue", "Corniche", "Spur", "Silver Shadow", "Silver Wraith", "Silver Spirit", "Silver Spur Centenary Edition"],
  "Saab": ["9-2X", "9-3", "9-4X", "9-5", "9-7X", "900", "9000", "Sonett", "96", "92", "95", "93", "900 Turbo", "Sonett III", "96 V4"],
  "Smart": ["EQ fortwo", "Forfour", "Roadster", "Crossblade", "Forfour Crossblade", "City Coupe", "City Cabrio", "Forfour EQ", "Forfour ICE", "ForTwo Electric Drive", "Roadster Brabus", "ForFour Cabrio"],
  "Subaru": ["Ascent", "Baja", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "SVX", "Tribeca", "WRX", "XT", "XV Crosstrek", "Justy", "Libero", "Rex", "Stella", "360", "XT6", "B9 Tribeca", "SVX"],
  "Suzuki": ["Aerio", "Equator", "Forenza", "Grand Vitara", "Kizashi", "Reno", "Samurai", "Sidekick", "Swift", "SX4", "Vitara", "X-90", "XL-7", "Swift Sport", "Kizashi Sport", "Grand Vitara XL-7"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Roadster", "Cybertruck", "Model S Plaid", "Model X Plaid", "Model 2 (Hypothetical future model)"],
  "Volkswagen": ["Arteon", "Atlas", "Atlas Cross Sport", "Beetle", "CC", "e-Golf", "Golf", "Jetta", "Passat", "Tiguan", "Touareg", "Corrado", "Eos", "Fox", "Golf SportWagen", "Jetta GLI", "Jetta SportWagen", "Phaeton", "Rabbit", "Routan", "Tiguan Limited", "Type 2", "Scirocco", "Passat CC", "Golf R32", "Jetta GLI 16V"],
  "Volvo": ["C30", "C40", "S40", "S60", "S70", "S80", "S90", "V40", "V50", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90", "240", "260", "850", "940", "960", "780", "PV544", "480", "440", "C70 Convertible", "V40 Cross Country", "V50 Sportswagon", "240 Wagon", "760", "940 Wagon", "960 Wagon", "V70 R", "XC70 Cross Country", "V70 XC"],
  "Infiniti": ["EX", "FX", "G35", "G37", "I30", "I35", "JX", "M35", "M37", "M45", "Q40", "Q45", "Q50", "Q60", "Q70", "QX30", "QX50", "QX56", "QX60", "QX70", "QX80", "I50", "G20", "I30t", "QX4"],
  "Jeep": ["Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Liberty", "Patriot", "Renegade", "Wrangler", "Grand Wagoneer", "Wagoneer", "Willys", "CJ-5"],
  "Kia": ["Cadenza", "Forte", "K900", "Niro", "Optima", "Rio", "Seltos", "Soul", "Soul EV", "Sportage", "Stinger", "Telluride", "Sorento", "Sedona", "Borrego", "Optima Hybrid", "K900 Luxury", "Forte5"],
  "Toyota": ["4Runner", "86", "Avalon", "C-HR", "Camry", "Corolla", "Corolla Cross", "GR Supra", "Highlander", "Land Cruiser", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza", "Yaris", "Celica", "Echo", "FJ Cruiser", "MR2", "Paseo", "Previa", "Sera", "Starlet", "Supra", "Tercel", "Tercel 4WD Wagon", "Cressida", "Matrix", "MR2 Spyder"]
};

let carRData = []; // Will be populated from AJAX response
let auctions = [];
let imagesAuctions = []; 

var addEventListener_count = 0;

var addNetworkEventListener_count = 0;
var addNetworkEventGenerateReportListener_count = 0;
var refresh_dashboard = false;

localStorage.setItem('offset', 0);
localStorage.setItem('limit', 10);

var inHouseMessage = "";
var compression_complete = 0;

//alert(window.location.hostname);

if(window.location.hostname == "localhost"){
  document.addEventListener('deviceready', onDeviceReady, false);

} else{
  
  onDeviceReady();
}
//const request = indexedDB.open("imageStorageDB", 1);

function onDeviceReady() {
    //alert(window.location.hostname);
    // Cordova is now initialized. Have fun!
    // Enable background mode
    //cordova.plugins.backgroundMode.setEnabled(true);
    //localStorage.setItem('themeColor','#32062e');


    /**if(window.location.hostname == "localhost"){
      if (cordova.platformId == "android") {   
        //server_Url = 'https://autovaluationpro.arybit.co.ke/api/';        
      } else {
        //alert(cordova.platformId);
      }
    } else{  
      //alert(window.location.hostname);  
      if (cordova.platformId == "android") {   
        //server_Url = 'https://autovaluationpro.arybit.co.ke/api/';      
      } else {
        //alert(cordova.platformId);
      }
    } */
    

    var app_version = '1.1.00';
    localStorage.setItem('version',app_version);

    if (localStorage.getItem('themeColor') ==null) {
      localStorage.setItem('themeColor','#32062e');
    } 
    
    if (localStorage.getItem('deviceID') ==null || localStorage.getItem('userUsername') ==null) {
      localStorage.setItem('deviceID',generateDeviceId());
      user_ID = localStorage.getItem('deviceID');
      document.querySelector(".landing-page").classList.add("d-none");
      document.querySelector(".login-page").classList.remove("d-none");
    }

    document.getElementById('getStartedBtn').addEventListener('click', function() {

      if (localStorage.getItem('deviceID') ==null || localStorage.getItem('userUsername') ==null) {
        localStorage.setItem('deviceID',generateDeviceId());
        user_ID = localStorage.getItem('deviceID');
        document.querySelector(".landing-page").classList.add("d-none");
        document.querySelector(".login-page").classList.remove("d-none");

      } else { 

        $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
        const formData = new FormData();
        formData.append('deviceID', localStorage.getItem('deviceID'));
        formData.append('version', localStorage.getItem('version')); 
        formData.append('login_email_phonenumber', localStorage.getItem('userEmail'));
        formData.append('login_Password', localStorage.getItem('userPasswordHash'));
        formData.append('action', 'loginUser');
        addNetworkEventListener_count = 1;
        clientBasicAuthenticationForm(formData);
      }
    });
    $('.loginUser').click(function() {
        //localStorage.setItem('version',app_version);

        const form = document.querySelector('.clientLoginForm');
        const formData = new FormData(form);  
        if (formData.get('login_email_phonenumber') != "" && formData.get('login_Password') != "") {
          document.querySelector(".login_error").innerHTML = ``;
          $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');

          //alert(localStorage.getItem('version'));

          formData.append('deviceID', localStorage.getItem('deviceID'));
          formData.append('version', localStorage.getItem('version')); 

          formData.append('action', 'loginUser');
          clientBasicAuthenticationForm(formData);
          
          //online(localStorage.getItem('user_ID'),localStorage.getItem('Email'),`${formData.get('login_email_phonenumber')}`,`${formData.get('login_Password')}`,"loginUser");
        } else {
          if (formData.get('login_email_phonenumber') == ""){
            document.querySelector(".login_error").innerHTML = `<span class=" text-danger text-center">Email/Phone number required</span>`;
          } else if (formData.get('login_Password') == "") {
            document.querySelector(".login_error").innerHTML = `<span class=" text-danger text-center">Password required</span>`;
          } else {
            document.querySelector(".login_error").innerHTML = `<span class=" text-danger text-center">Email/Phone Number and Password required</span>`;
          }
        }
    });
    $('.sendVerification_Code').click(function() {
        //localStorage.setItem('version',app_version);

        const form = document.querySelector('.client_psd_recovery_Form');
        const formData = new FormData(form);
        if (formData.get('psd_recovery_email_phonenumber') != "" ) {
            document.querySelector(".psd_recovery_error").innerHTML = '';
            $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
            formData.append('deviceID', localStorage.getItem('deviceID'));
            formData.append('version', localStorage.getItem('version')); 

            formData.append('action', 'sendVerificationCode');
            addNetworkEventListener_count = 1;
            clientBasicAuthenticationForm(formData);
            
        } else {
            document.querySelector(".psd_recovery_error").innerHTML = `<span class=" text-danger text-center">Email/Phone number required</span>`;
        }
        
    });
    $('.verify_Code').click(function() {
        //localStorage.setItem('version',app_version);

        const form = document.querySelector('.client_psd_recovery_Form');
        const formData = new FormData(form);
        if (formData.get('psd_recovery_code') != "" ) {
            document.querySelector(".psd_recovery_error").innerHTML = '';
            $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
            formData.append('deviceID', localStorage.getItem('deviceID'));
            formData.append('version', localStorage.getItem('version')); 

            formData.append('action', 'verifyCode');
            addNetworkEventListener_count = 1;
            clientBasicAuthenticationForm(formData);            
        } else {
            document.querySelector(".psd_recovery_error").innerHTML = `<span class=" text-danger text-center">Verification code required</span>`;
        }
    });
    $('.submit_new_password').click(function() {
        //localStorage.setItem('version',app_version);

        const form = document.querySelector('.client_psd_recovery_Form');
        const formData = new FormData(form);
        if (formData.get('confirm_new_password') != "" && formData.get('new_password') != "") {
            if (formData.get('confirm_new_password') == formData.get('new_password')) {
                document.querySelector(".psd_recovery_error").innerHTML = ``;
                $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
                formData.append('deviceID', localStorage.getItem('deviceID'));
                formData.append('version', localStorage.getItem('version')); 

                formData.append('action', 'submitPassword');
                addNetworkEventListener_count = 1;
                clientBasicAuthenticationForm(formData);
              } else {
                document.querySelector(".psd_recovery_error").innerHTML = `<span class=" text-danger text-center">Password does not match</span>`;
            }
        } else {
          document.querySelector(".psd_recovery_error").innerHTML = `<span class=" text-danger text-center">Password required</span>`;
        }
    });
    $('.dropdown-item').click(function() {
      // Get the text of the clicked dropdown item
      var selectedRole = $(this).text();
      
      // Set the text of the .user-role span with the selected role
      $('.user-role').text(selectedRole);
    });
    $('.valuer-dropdown-item').click(function() {
      // Get the text of the clicked dropdown item
      var selectedRole = $(this).text();
      $('#select-company-list').html('Select Company');
      if (selectedRole == "Director") {
        document.querySelector(".select-company").classList.add("d-none");
        document.querySelector(".company-details").classList.remove("d-none");
        document.querySelector("#select-company-list").classList.remove("d-none");
      } else {
        document.querySelector(".select-company").classList.remove("d-none");
        document.querySelector(".company-details").classList.add("d-none");
        document.querySelector("#select-company-list").classList.add("d-none");
        $('#select-company-list').text("");

      }
      // Set the text of the .user-role span with the selected role
      $('.valuer-user-role').text(selectedRole);
      $('#valuer-companyRegistrationNumber').val("");
      $('#valuer-companyname').val("");

    });  
    $('#select-company-list').click(function() {
      // Toggle the visibility of the company selection and company details sections
      $('.select-company').toggleClass('d-none');
      $('.company-details').toggleClass('d-none');
  
      // Check if the select-company is currently visible and update the button text accordingly
      if ($('.select-company').hasClass('d-none')) {
          $('#select-company-list').html('Select Company');
          $('#valuer-companyRegistrationNumber').val("");
          $('#valuer-companyname').val("");
          $('#companyEmployeeNumber').val("");
      } else {
          $('#select-company-list').html('New Company');
          $('#provider_companyname').val("");
          $('#companyRegistrationNumber').val("");
          $('#contactEmail').val("");
          $('#contactPhone').val("");
          $('#provider_address').val("");
          $('#provider_city').val("");
          $('#provider_postalcode').val("");
          $('#provider_country').val("");
          $('#upload_uploadCompanyLogo_help').html("");
      }
    });  
    $('.next-register-button').click(function() {
        const form = document.querySelector('.clientRegistrationForm');
        const formData = new FormData(form);
        if (formData.get('provider_firstname') != "" || formData.get('provider_lastname') != "") {
          if (formData.get('provider_email_phonenumber') != "") {
            if (formData.get('Password') != "") {
              if (formData.get('Password') == formData.get('confirm_password')) {

                if ($('.user-role').text() == "Individual") {
                  document.querySelector(".register_error").innerHTML = ` `;
                  const mainRole = $('.user-role').text();
                  const userRole = $('.valuer-user-role').text();
                  const carDealerUserRole = $('.car-dealer-user-role').text();
                  // Append additional form data
                  formData.append('mainRole', mainRole);
                  formData.append('userRole', userRole);
                  formData.append('carDealerRole', carDealerUserRole);
                  formData.append('deviceID', localStorage.getItem('deviceID'));
                  formData.append('version', localStorage.getItem('version')); 

                  formData.append('action', 'registerUser');

                  $(this).html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> <span class="visually-hidden">Loading...</span>');
                  clientBasicAuthenticationForm(formData);

                  //online(localStorage.getItem('user_ID'),formData.get('provider_firstname') + " " + formData.get('provider_lastname'),`${formData.get('provider_email_phonenumber')}`,`${formData.get('Password')}`,"registerValuer");
                } else {

                  $(this).html('<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> <span class="visually-hidden">Loading...</span>');
                  $.ajax({
                    url: server_Url +  'checkuser.php',
                    method: 'POST', // Keep the HTTP method as POST
                    data: {
                      email_phonenumber: formData.get('provider_email_phonenumber')
                    },
                    dataType: 'json', // Expecting a JSON response
                    success: function(response) {
                      //alert(JSON.stringify(response));
                      if (response.success) {
                        $('.next-register-button').html('Next');
                        $('.register_error').html('');
                        document.querySelector(".client_info").classList.add("d-none");
                        document.querySelector(".password_info").classList.remove("d-none");
                        document.querySelector(".next-register-button").classList.add("d-none");

                        document.querySelector(".user-role-btn-group").classList.add("d-none");
                        if ($('.user-role').text() == "Car Dealer") {
                          $('.valuer-user-role').text("");
                          //document.querySelector(".select-company").classList.add("d-none");
                          //document.querySelector(".company-details").classList.remove("d-none");
                          $('#select-company-list').html('New Company');
                          document.querySelector("#select-company-list").classList.remove("d-none");
                          document.querySelector(".car-dealer-user-role-btn-group").classList.remove("d-none");
                        } else if ($('.user-role').text() == "Car Valuer"){
                          
                          $('#select-company-list').text("");
                          $('#valuer-companyRegistrationNumber').val("");
                          document.querySelector(".valuer-user-role-btn-group").classList.remove("d-none");
                        }

                        document.querySelector("#registerValuer").classList.remove("d-none");
                      } else {
                        $('.next-register-button').html('Next');
                        $('.register_error').html('<span class="text-danger">' + response.info + '</span>');
                      }
                    },
                    error: function(xhr, status, error) {
                      showSnackbar(JSON.stringify(xhr));
                    }
                  });
                }
                
              } else {
                document.querySelector(".register_error").innerHTML = `<span class=" text-danger text-center">Password does not match</span>`;
                showSnackbar($('.register_error').text());
              }
            } else {
              document.querySelector(".register_error").innerHTML = `<span class=" text-danger text-center">Password required</span>`;
              scrollAndFocusElement('Password');
              showSnackbar($('.register_error').text());
            }
          } else {
            document.querySelector(".register_error").innerHTML = `<span class=" text-danger text-center">Email required</span>`;
            scrollAndFocusElement('provider_email_phonenumber');
            showSnackbar($('.register_error').text());
          }
        } else {
          document.querySelector(".register_error").innerHTML = `<span class=" text-danger text-center">First Name Or Last Name required</span>`;
          scrollAndFocusElement('provider_firstname');
          showSnackbar($('.register_error').text());
        }
    });

    //alert(localStorage.getItem('version'));

    document.getElementById("registerValuer").addEventListener("click", function() {
      const form = document.querySelector('.clientRegistrationForm');
      localStorage.setItem('version',app_version);

      const formData = new FormData(form);
      const mainRole = $('.user-role').text();
      const userRole = $('.valuer-user-role').text();
      const carDealerUserRole = $('.car-dealer-user-role').text();
  
      const selectedCompany = $('#select-company-list').text();

      const checkRequiredFields = (fields) => {
          return fields.every(field => formData.get(field) !== "");
      };
  
      const handleFormErrors = (message, elementId) => {
          document.querySelector(".register_error").innerHTML = `<span class="text-danger text-center">${message}</span>`;
          scrollAndFocusElement(elementId);
          showSnackbar(message);
      };
  
      let hasError = false;
  
      if ((mainRole != "Appraiser") && (
          (userRole === "Director" && selectedCompany === "Select Company") || 
          (carDealerUserRole === "Micro Finance" && selectedCompany === "Select Company") || 
          (carDealerUserRole === "Bank" && selectedCompany === "Select Company") || 
          (carDealerUserRole === "Insurance" && selectedCompany === "Select Company"))) {
          
          if (checkRequiredFields(['provider_companyname', 'companyRegistrationNumber', 'contactEmail', 'contactPhone'])) {
              if (!checkRequiredFields(['provider_address', 'provider_city', 'provider_postalcode', 'provider_country'])) {
                const missingField = formData.get('provider_address') === "" ? 'Company Address' : 
                                     formData.get('provider_city') === "" ? 'City' : 
                                     formData.get('provider_postalcode') === "" ? 'Postal Code' :
                                     'Country';
                var elementId = '';
                if (missingField.toLowerCase().replace(' ', '') == "companyaddress") {
                  elementId = 'provider_address';
                } else if (missingField.toLowerCase().replace(' ', '') == "city") {
                  elementId = 'provider_city';
                } else if (missingField.toLowerCase().replace(' ', '') == "postalcode") {
                  elementId = 'provider_postalcode';
                } else if (missingField.toLowerCase().replace(' ', '') == "country") {
                  elementId = 'provider_country';
                }
                handleFormErrors(`${missingField} required`, elementId);
                hasError = true;
              }
          } else {
              const missingField = formData.get('provider_companyname') === "" ? 'Company Name' : 
                                   formData.get('companyRegistrationNumber') === "" ? 'Company Registration Number' : 
                                   formData.get('contactEmail') === "" ? 'Contact Email' :
                                   'Contact Phone';
              var elementId = '';
              // File input element
              const fileToUpload = document.querySelector('input[name="companyLogoFileToUpload[]"]');      
              // Validation check
              if (fileToUpload.files.length == 0) { // Check if file is attached
                handleFormErrors("Company Logo Required", fileToUpload);
                hasError = true;
              } else if (missingField.toLowerCase().replace(' ', '') == "companyname") {
                elementId = 'provider_companyname';
              } else if (missingField.toLowerCase().replace(' ', '') == "companyregistration number") {
                elementId = 'companyRegistrationNumber';
              } else if (missingField.toLowerCase().replace(' ', '') == "contactemail") {
                elementId = 'contactEmail';
              } else if (missingField.toLowerCase().replace(' ', '') == "contactphone") {
                elementId = 'contactPhone';
              }
              if (elementId !='') {             
                handleFormErrors(`${missingField} required`, elementId);
                hasError = true;
              } 
          }
      } else {
          if (!checkRequiredFields(['valuer-companyname', 'valuer-companyRegistrationNumber', 'companyEmployeeNumber'])) {
              const missingField = formData.get('valuer-companyname') === "" ? 'Company Name' : 
                                   formData.get('valuer-companyRegistrationNumber') === "" ? 'Company Registration Number' : 'Company Employee Number';
              
              var elementId = missingField.toLowerCase().replace(' ', '');
              if (missingField.toLowerCase().replace(' ', '') == "companyname") {
                elementId = 'valuer-companyname';
              } else if (missingField.toLowerCase().replace(' ', '') == "companyregistration number") {
                elementId = 'valuer-companyRegistrationNumber';
              } else if (missingField.toLowerCase().replace(' ', '') == "companyemployee number") {
                elementId = 'companyEmployeeNumber';
              }
              handleFormErrors(`${missingField} required`, elementId);
              hasError = true;
          }
      }
  
      if (!hasError) {
          // Clear previous error
          document.querySelector(".register_error").innerHTML = '';
          // Show loading spinner
          document.getElementById("registerValuer").innerHTML = `<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`;
          // Call upload function
          formData.append('mainRole', mainRole);
          formData.append('userRole', userRole);
          formData.append('carDealerRole', carDealerUserRole);
          formData.append('deviceID', localStorage.getItem('deviceID'));
          formData.append('version', localStorage.getItem('version')); 
          //alert(localStorage.getItem('version'));
          formData.append('action', 'registerUser');
          clientBasicAuthenticationForm(formData);

      }
    });  
    $('.car-dealer-dropdown-item').click(function() {
      // Get the text of the clicked dropdown item
      var selectedRole = $(this).text();
      if (selectedRole == "Micro Finance" || selectedRole == "Bank" || selectedRole == "Insurance" || selectedRole == "Lease") {
        document.querySelector(".select-company").classList.add("d-none");
        document.querySelector(".company-details").classList.remove("d-none");
        document.querySelector("#select-company-list").classList.remove("d-none");
      } else {
        document.querySelector(".select-company").classList.remove("d-none");
        document.querySelector(".company-details").classList.add("d-none");
        document.querySelector("#select-company-list").classList.add("d-none");
      }
      $('#select-company-list').html('Select Company');
      // Set the text of the .user-role span with the selected role
      $('.car-dealer-user-role').text(selectedRole);
      $('.valuer-user-role').text("");
      $('#valuer-companyRegistrationNumber').val("");
      $('#valuer-companyname').val("");
    });    
    $('.login-button').click(function() {
        if (localStorage.getItem('user_ID') ==null || localStorage.getItem('username') ==null) {
            localStorage.setItem('user_ID',generateDeviceId());
            user_ID = localStorage.getItem('user_ID');
            username = Math.random().toString(36).substring(2, 8);
            email = username + "@arybit.com";
            password_hash = Math.random().toString(36).substring(2, 6);
            localStorage.setItem('username',username);
            localStorage.setItem('email',email);
            localStorage.setItem('password_hash',password_hash);

            document.querySelector(".landing-page").classList.add("d-none");
            document.querySelector(".login-page").classList.remove("d-none");
        }
        document.querySelector(".login-page").classList.remove("d-none");
        document.querySelector(".register-page").classList.add("d-none");
        document.querySelector(".landing-page").classList.add("d-none");
        document.querySelector(".client_info").classList.remove("d-none");
        document.querySelector(".password_info").classList.add("d-none");
        document.querySelector(".forgot-password-page").classList.add("d-none");
        document.querySelector("#next-register-button").classList.remove("d-none");
        document.querySelector("#registerValuer").classList.add("d-none");

        document.querySelector(".recovery_email").classList.remove("d-none");
        document.querySelector(".sendVerification_Code").classList.remove("d-none");
        document.querySelector(".verify_Code").classList.add("d-none");
        document.querySelector(".submit_new_password").classList.add("d-none");
        document.querySelector(".recovery_code").classList.add("d-none");
        document.querySelector(".recovery_new_password").classList.add("d-none");

    });
    $('.register-button').click(function() {
        if (localStorage.getItem('user_ID') ==null || localStorage.getItem('username') ==null) {
            localStorage.setItem('user_ID',generateDeviceId());
            user_ID = localStorage.getItem('user_ID');
            username = Math.random().toString(36).substring(2, 8);
            email = username + "@arybit.com";
            password_hash = Math.random().toString(36).substring(2, 6);
            localStorage.setItem('username',username);
            localStorage.setItem('email',email);
            localStorage.setItem('password_hash',password_hash);

            document.querySelector(".landing-page").classList.add("d-none");
            document.querySelector(".login-page").classList.remove("d-none");
        }
        document.querySelector(".register-page").classList.remove("d-none");
        document.querySelector(".login-page").classList.add("d-none");
        document.querySelector(".landing-page").classList.add("d-none");
        document.querySelector(".client_info").classList.remove("d-none");
        document.querySelector(".password_info").classList.add("d-none");
        document.querySelector(".forgot-password-page").classList.add("d-none");
        document.querySelector("#next-register-button").classList.remove("d-none");
        document.querySelector("#registerValuer").classList.add("d-none");

        document.querySelector(".recovery_email").classList.remove("d-none");
        document.querySelector(".sendVerification_Code").classList.remove("d-none");
        document.querySelector(".verify_Code").classList.add("d-none");
        document.querySelector(".submit_new_password").classList.add("d-none");
        document.querySelector(".recovery_code").classList.add("d-none");
        document.querySelector(".recovery_new_password").classList.add("d-none");

    });   
    $('.forgot-password-button').click(function() {
        document.querySelector(".forgot-password-page").classList.remove("d-none");
        document.querySelector(".client_info").classList.remove("d-none");
        document.querySelector(".login-page").classList.add("d-none");
        document.querySelector(".register-page").classList.add("d-none");
        document.querySelector(".password_info").classList.add("d-none");
        document.querySelector("#next-register-button").classList.remove("d-none");
        document.querySelector("#registerValuer").classList.add("d-none");

        document.querySelector(".settings-page").classList.add("d-none");
        document.querySelectorAll(".login_buttons").forEach(element => {
          element.classList.remove("d-none");                
        });
        document.querySelectorAll(".nav-settings").forEach(element => {
          element.classList.add("d-none");                
        });

    });
    $('.logout-button').click(function() {
        localStorage.clear();
        document.querySelector(".landing-page").classList.remove("d-none");
        document.querySelector(".login-page").classList.remove("d-none");
        document.querySelector(".register-page").classList.add("d-none");
        document.querySelector(".client_info").classList.remove("d-none");
        document.querySelector(".password_info").classList.add("d-none");
        document.querySelector(".forgot-password-page").classList.add("d-none");
        document.querySelector("#next-register-button").classList.remove("d-none");
        document.querySelector("#registerValuer").classList.add("d-none");
        //alert('client_info');
        //document.querySelector(".settings-page").classList.add("d-none");
        document.querySelector(".report-information").classList.add("d-none");
        document.querySelector(".recovery_email").classList.remove("d-none");
        document.querySelector(".sendVerification_Code").classList.remove("d-none");
        document.querySelector(".verify_Code").classList.add("d-none");
        document.querySelector(".submit_new_password").classList.add("d-none");
        document.querySelector(".recovery_code").classList.add("d-none");
        document.querySelector(".recovery_new_password").classList.add("d-none");
        localStorage.setItem('version',app_version);
        localStorage.setItem('themeColor','#32062e');
        //alert('themeColor');
        var corporateRefNo = generateCorporateRefNo();
        var serialNo = generateSerialNo();
        localStorage.setItem('corporateRefNo',corporateRefNo);
        localStorage.setItem('FormID',0);
        localStorage.setItem('userCompanyName',"");
        localStorage.setItem('inspectVehicleID',0);
        localStorage.setItem('serialNo',serialNo);
        document.getElementById('corporateRefNo').value = corporateRefNo;
        document.getElementById('serialNo').value = serialNo;
        localStorage.setItem('offset', 0);
        localStorage.setItem('limit', 10);
        // Hide the modal
        //alert();
        const accountSettingsModal = document.getElementById('accountSettingsModal');
        const qrCodeModal = bootstrap.Modal.getInstance(accountSettingsModal);        
        if (qrCodeModal) {
            qrCodeModal.hide(); // Properly hides the modal
        } else {
           alert('Modal instance not found!');
        }        
        toggleDashboardVisibility('.login-page', ['.valuer-dashboard', '.individual-dashboard', '.approver-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard', '.carDealer-dashboard']);
        document.querySelectorAll(".login_buttons").forEach(element => {
            element.classList.remove("d-none");
        });
        document.querySelectorAll(".nav-settings").forEach(element => {
          element.classList.add("d-none");
        });
        //$('#settingsModalLabel').modal('hide');
    }); 
    $('.settings-button').click(function() {
      document.querySelector(".settings-page").classList.remove("d-none");
      document.querySelector(".report-information").classList.add("d-none");
    });
    $('.home-button').click(function() {
      document.querySelector(".report-information").classList.remove("d-none");
      document.querySelector(".settings-page").classList.add("d-none");

      document.querySelector(".ApproverForms").classList.add("d-none");
      document.querySelector(".valuation_Form").classList.remove("d-none");
    });
    $('.valuation-reports-button').click(function() {
      document.querySelector(".settings-page").classList.add("d-none");

      document.querySelector(".valuation_Form").classList.add("d-none");
      document.querySelector(".ApproverForms").classList.remove("d-none");

      document.querySelector("#valuationForm").style.display = "block";
      document.querySelector(".report-information").classList.remove("d-none");

      document.querySelector("#report").style.display = "none";

    }); 
    $(document).on('click', '.edit-valuation-requests', function() {
      var RequestID = $(this).attr('RequestID'); 
      var VehicleID = $(this).attr('VehicleID');
      response_requests.forEach(requests => {
        if (requests.RequestID == RequestID) {
          $("#client-request-id").val(requests.RequestID);
          if (requests.ClientName !='') {
            $("#client-name-request").val(requests.ClientName);
            $("#client-contact-request").val(requests.Contact);
            $("#client-email-request").val(requests.Email);
            $("#client-kra-request").val(requests.KRA);
          }
        }
      });
      response_requestsVehicles.forEach(vehicles => {
        if (vehicles.VehicleID == VehicleID) {
          $("#individual-vehicle-make").val(vehicles.Make);
          $("#individual-vehicle-model").val(vehicles.Model);
          $("#individual-vehicle-year").val(vehicles.Year);
          $("#individual-vehicle-mileage").val(vehicles.Mileage);
          $("#individual-vehicle-color").val(vehicles.Color);
          $("#individual-vehicle-transmission").val(vehicles.Transmission);
          $("#individual-vehicle-fuelType").val(vehicles.FuelType);
          $("#individual-vehicle-bodyType").val(vehicles.BodyType);
          $("#logbookPhotoId").html(`
            <div class="card imgUp_logbookPhoto imgUp position-relative" style="background-image: url('${vehicles.LogbookFileURL}');">
                <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg_logbookPhoto del_logbookPhoto"><i class="fa-solid fa-xmark"></i></i>
                <label class="choose_logbookPhoto">Logbook Photo <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> <input type="file" name="logbookPhotoToUpload[]" class="form-control-file uploadlogbookPhoto img" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;"></label>
            </div>
          `);
          $("#additionalInfo").val(vehicles.VehicleCondition);
        }
      });
    });
    $(document).on('click', '.delete-valuation-requests', function() {
      var RequestID = $(this).attr('RequestID'); 
      var action = "deleteValuationRequests"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, RequestID);
    
    });
    $(document).on('click', '.auctions-valuation-requests', function() {
      var RequestID = $(this).attr('RequestID'); 
      var action = "featuredAuctions"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, RequestID);
    
    });
    $(document).on('click', '.inspect-vehicles-requests', function() {
      var AssignmentID = $(this).attr('AssignmentID'); 
      var VehicleID = $(this).attr('VehicleID'); 
      inspect_action = "submitReport";
      if ($(this).text() == 'Continue') {
        //action = "editReport";
      }
      //alert(inspect_action);
      document.querySelector("#valuationForm").style.display = "block";
      document.querySelector("#report").style.display = "none";
      document.querySelector(".camera-toggle").classList.remove("d-none");
      document.querySelectorAll(".resumeReport").forEach(element => {
        element.classList.remove("d-none");
      });

      response_requestsVehicles.forEach(vehicle => {    
        if (vehicle.VehicleID == VehicleID) {
          var clientName = '';
          var emaill = '';
          response_valuerUsers.forEach(user => {    
            if (user.UserID == vehicle.UserID) {
              clientName = user.Username;
              emaill = user.Email;
            }
          });
          $("#clientName").val(clientName);
          $("#emaill").val(emaill); 
          $("#vehicle-assignment-id").val(AssignmentID);
          $("#vehicle-id").val(VehicleID);

          $("#valuer").val(localStorage.getItem('userCompanyName'));
          $("#examiner").val(localStorage.getItem('userUsername'));

          $("#make").val(vehicle.Make);
    
          // Create a dictionary for reports based on FormID
          const reportsByFormID = {};
          response_reports.forEach(report => {
              reportsByFormID[report.FormID] = report;
          });
          
          $("#corporateRefNo").val('');
          $("#serialNo").val(''); 

          $("#model").val(vehicle.Model);
          $("#yearOfManf").val(vehicle.Year);
          $("#odometerReading").val(vehicle.Mileage);
          $("#colour").val(vehicle.Color);
          $("#gearBox").val(vehicle.Transmission);
          $("#fuelType").val(vehicle.FuelType);
          $("#generalCondition").val(vehicle.VehicleCondition);

          response_requests.forEach(requests => {

            if (requests.VehicleID == VehicleID) {

              if (requests.ClientName !='') {
                $("#clientName").val(requests.ClientName);
                $("#contactNumber").val(requests.Contact);
                $("#emaill").val(requests.Email);
                $("#contactKRA").val(requests.KRA);
              }

              response_valuationForms.forEach(valuation => {                
                const report = reportsByFormID[valuation.FormID];
                if (report) {
                    if (report.FormID == valuation.FormID) {
                      if (report.VehicleID == VehicleID) {
                        $("#corporateRefNo").val(valuation.CorporateRefNo);
                        $("#serialNo").val(valuation.SerialNo);  
                        $("#contactKRA").val(report.KRAPin);

                        $("#valuer").val(valuation.Valuer);
                        //if (valuation.Valuer == '') {
                          $("#valuer").val(localStorage.getItem('userCompanyName'));
                        //}
                        $("#valuation_Date").val(valuation.ValuationDate);
                        $("#clientName").val(valuation.ClientName);
                        $("#contactNumber").val(valuation.ContactNumber);
                        $("#emaill").val(valuation.Email);  // Correct the ID from emaill to email
                        $("#insurer").val(valuation.Insurer);
                        $("#policyNo").val(valuation.PolicyNo);
                        $("#expiryDate").val(valuation.ExpiryDate);
                        $("#registrationNo").val(valuation.RegistrationNo);
                        $("#chassisNo").val(valuation.ChassisNo);
                        $("#make").val(valuation.Make);
                        $("#model").val(valuation.Model);
                        $("#modelType").val(valuation.ModelType);
                        $("#engineNo").val(valuation.EngineNo);
                        $("#engineRating").val(valuation.EngineRating);
                        $("#colour").val(valuation.Colour);
                        $("#dateOfReg").val(valuation.DateOfReg);
                        $("#yearOfManf").val(valuation.YearOfManf);
                        $("#odometerReading").val(valuation.OdometerReading);
                        $("#fuelType").val(valuation.FuelType);
                        $("#countryOfOrigin").val(valuation.CountryOfOrigin);
                        $("#noOfAirbags").val(valuation.NoOfAirbags);
                        $("#typesOfLights").val(valuation.TypesOfLights);
                        $("#antiTheft").val(valuation.AntiTheft);
                        $("#tyres").val(valuation.Tyres);
                        $("#coachworkNotes").val(valuation.CoachworkNotes);
                        $("#electricalNotes").val(valuation.ElectricalNotes);
                        $("#mechanicalNotes").val(valuation.MechanicalNotes);
                        $("#extras").val(valuation.Extras);
                        $("#windscreenEstimate").val(valuation.WindscreenEstimate);
                        $("#radioEstimate").val(valuation.RadioEstimate);
                        $("#marketValue").val(valuation.MarketValue);
                        $("#forcedValue").val(valuation.ForcedValue);
                        $("#generalCondition").val(valuation.GeneralCondition);
                        $("#remarks").val(valuation.Remarks);
                        $("#remedy").val(valuation.Remedy);
                        $("#locationOfInspection").val(valuation.LocationOfInspection);
                        $("#destination").val(valuation.Destination);
                        $("#examiner").val(valuation.Examiner);
                        if (valuation.Examiner == '') {
                          $("#examiner").val(localStorage.getItem('userUsername'));                
                        }
                        $("#dateOfInspection").val(valuation.DateOfInspection);  
  
                      }
                    }
                }  
              });

              if ($("#corporateRefNo").val() =='') {
                var corporateRefNo = generateCorporateRefNo();
                var serialNo = generateSerialNo();
                localStorage.setItem('serialNo', serialNo);
                document.getElementById('corporateRefNo').value = localStorage.getItem('corporateRefNo');
                document.getElementById('serialNo').value = serialNo;
              }

            }
          });
          
          $('#vehiclePhotos').html(``);
          localStorage.setItem('inspectVehicleID',VehicleID);     
          
          let additional_requests_checklist = {};
          let inspections_requests_valuations = response_inspections_requests_valuations || []; // Ensure it's an array          
          if (Array.isArray(inspections_requests_valuations)) {
              var selectedInspectionsValuations = inspections_requests_valuations.find(function(details) {
                  return details.vehicle_id == localStorage.getItem('inspectVehicleID');
              });          
              if (selectedInspectionsValuations && selectedInspectionsValuations.additional_checklist) {
                  try {
                      additional_requests_checklist = JSON.parse(selectedInspectionsValuations.additional_checklist); // ✅ Convert string to object
                      maessa_up_Arr = selectedInspectionsValuations.maessa_up_Arr;

                  } catch (error) {
                      showSnackbar("Error parsing additional_requests_checklist JSON:", error);
                  }
              }
          }          

          localStorage.setItem('requests_themePdfColor', additional_requests_checklist.themePdfColor); // Save to localStorage
          localStorage.setItem('requests_themePdfFontSize', additional_requests_checklist.themePdfFontSize); // Save to localStorage
          localStorage.setItem('requests_inAppCamera', additional_requests_checklist.inAppCamera); // Save to localStorage
          localStorage.setItem('requests_videoSection', additional_requests_checklist.videoSection); // Save to localStorage
          localStorage.setItem('requests_aiObjectsDetection', additional_requests_checklist.aiObjectsDetection); // Save to localStorage
          localStorage.setItem('requests_aiDamageDetection', additional_requests_checklist.aiDamageDetection); // Save to localStorage
          localStorage.setItem('requests_aiValuePrediction', additional_requests_checklist.aiValuePrediction); // Save to localStorage
          localStorage.setItem('requests_priorityStandard', additional_requests_checklist.priorityStandard); // Save to localStorage
          localStorage.setItem('requests_priorityExpress', additional_requests_checklist.priorityExpress); // Save to localStorage

          //alert(additional_requests_checklist.videoChecklistArray);
          let videoChecklistString  = additional_requests_checklist.videoChecklistArray || []; // Preserve selections
          //alert(additional_requests_checklist.videoChecklistArray);

          if (videoChecklistString  !== null && videoChecklistString .length > 0) {
              let videoChecklistArray = videoChecklistString .split(","); // Convert string to array
              localStorage.setItem("requests_videoChecklistArray", JSON.stringify(videoChecklistArray));
          }          
          //alert(localStorage.getItem('requests_inAppCamera'));

          inspecVehiclePhotosInput(localStorage.getItem('inspectVehicleID'));

        }
      });

      var thisAction = "inspectVehiclesRequests"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      var IDS = AssignmentID + ',' + VehicleID;
      // Call the API function
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), thisAction, IDS);

    });
    $(document).on('click', '.edit-button', function() {
      var FormID = $(this).attr('FormID'); 
      localStorage.setItem('FormID',FormID);
      
      action = "editReport"; 
      inspect_action = "";

      uploadedFiles = [];

      uploadedTimeFiles = [];

      uploadedVideoFiles = [];
      uploadedTimeVideoFiles = [];

      document.querySelector(".camera-toggle").classList.remove("d-none");
      document.querySelectorAll(".resumeReport").forEach(element => {
        element.classList.remove("d-none");
      });
    
      // Create a dictionary for reports based on FormID
      const reportsByFormID = {};
      response_reports.forEach(report => {
          reportsByFormID[report.FormID] = report;
      });
      
      response_valuationForms.forEach(valuation => {
          if (valuation.FormID == FormID) {
              // Set form values using jQuery
              
              const report = reportsByFormID[valuation.FormID];
              if (report) {
                  $("#contactKRA").val(report.KRAPin);
              }

              $("#corporateRefNo").val(valuation.CorporateRefNo);
              $("#serialNo").val(valuation.SerialNo);
              $("#valuer").val(valuation.Valuer);
              //if (valuation.Valuer == '') {
                $("#valuer").val(localStorage.getItem('userCompanyName'));
              //}
              $("#valuation_Date").val(valuation.ValuationDate);
              $("#clientName").val(valuation.ClientName);
              $("#contactNumber").val(valuation.ContactNumber);
              $("#emaill").val(valuation.Email);  // Correct the ID from emaill to email
              $("#insurer").val(valuation.Insurer);
              $("#policyNo").val(valuation.PolicyNo);
              $("#expiryDate").val(valuation.ExpiryDate);
              $("#registrationNo").val(valuation.RegistrationNo);
              $("#chassisNo").val(valuation.ChassisNo);
              $("#make").val(valuation.Make);
              $("#model").val(valuation.Model);
              $("#modelType").val(valuation.ModelType);
              $("#engineNo").val(valuation.EngineNo);
              $("#engineRating").val(valuation.EngineRating);
              $("#colour").val(valuation.Colour);
              $("#dateOfReg").val(valuation.DateOfReg);
              $("#yearOfManf").val(valuation.YearOfManf);
              $("#odometerReading").val(valuation.OdometerReading);
              $("#fuelType").val(valuation.FuelType);
              $("#countryOfOrigin").val(valuation.CountryOfOrigin);
              $("#noOfAirbags").val(valuation.NoOfAirbags);
              $("#typesOfLights").val(valuation.TypesOfLights);
              $("#antiTheft").val(valuation.AntiTheft);
              $("#tyres").val(valuation.Tyres);
              $("#coachworkNotes").val(valuation.CoachworkNotes);
              $("#electricalNotes").val(valuation.ElectricalNotes);
              $("#mechanicalNotes").val(valuation.MechanicalNotes);
              $("#extras").val(valuation.Extras);
              $("#windscreenEstimate").val(valuation.WindscreenEstimate);
              $("#radioEstimate").val(valuation.RadioEstimate);
              $("#marketValue").val(valuation.MarketValue);
              $("#forcedValue").val(valuation.ForcedValue);
              $("#generalCondition").val(valuation.GeneralCondition);
              $("#remarks").val(valuation.Remarks);
              $("#remedy").val(valuation.Remedy);
              $("#locationOfInspection").val(valuation.LocationOfInspection);
              $("#destination").val(valuation.Destination);
              $("#examiner").val(valuation.Examiner);
              if (valuation.Examiner == '') {
                $("#examiner").val(localStorage.getItem('userUsername'));                
              }
              $("#dateOfInspection").val(valuation.DateOfInspection);  
              // Toggle visibility
              $(".ApproverForms").addClass("d-none");
              $(".valuation_Form").removeClass("d-none");
              document.querySelector(".report-information").classList.remove("d-none");
              document.querySelector("#valuationForm").style.display = "block";

              $('#vehiclePhotos').html(``);
              vehiclePhotosInput(localStorage.getItem('FormID'));             
          }
      });
    });
    $(document).on('click', '.reject-button', function() {
      var FormID = $(this).attr('FormID'); 
      var action = "rejectReport"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      //onlineGimbo(localStorage.getItem('onlineGimboUsername'), localStorage.getItem('response_arybittrack_email'), localStorage.getItem('response_arybittrack_password'), action, FormID);
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, FormID);
    });
    $(document).on('click', '.response-notifications', function () {
      var action = $(this).attr('data-action'); // Get action type (mark/delete)
      if (action == 'mark') {
        action = "markNotifications"; 
      } else {
        action = "deleteNotifications"; 
      }
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, '');

    }); 
    $(document).on('click', '.approve-button', function() {
      var FormID = $(this).attr('FormID'); 
      var action = "approveReport"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      //onlineGimbo(localStorage.getItem('onlineGimboUsername'), localStorage.getItem('response_arybittrack_email'), localStorage.getItem('response_arybittrack_password'), action, FormID);
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, FormID);
    });
    $(document).on('click', '.delete-valuation-button', function() {
      var FormID = $(this).attr('FormID'); 
      var action = "deleteReport"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      //onlineGimbo(localStorage.getItem('onlineGimboUsername'), localStorage.getItem('response_arybittrack_email'), localStorage.getItem('response_arybittrack_password'), action, FormID);
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, FormID);
    });
    $(document).on('click', '.dispatch-button', function() {
      var FormID = $(this).attr('FormID'); 
      var action = "dispatchReport"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      //onlineGimbo(localStorage.getItem('onlineGimboUsername'), localStorage.getItem('response_arybittrack_email'), localStorage.getItem('response_arybittrack_password'), action, FormID);
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, FormID);
    });
    $(document).on('click', '.accept-valuation-requests', function() {
      const RequestID = $(this).attr('data-request-id'); 
      const ValuationTypeID = $(this).attr('data-valuation-type-id'); 
      const ValuerID = $(this).attr('data-valuer-id');
      const action = "acceptValuationRequests";  
      // Update the spinner in the clicked element
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');    
      var IDS = RequestID + ',' + ValuerID;  
      // Call the API function
      refresh_dashboard = true;
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, IDS);
    });      
    $(document).on('click', '.reject-valuation-requests', function() {
      var RequestID = $(this).attr('RequestID'); 
      var ValuationTypeID = $(this).attr('ValuationTypeID');
      var action = "rejectValuationRequests"; 
      $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      //onlineGimbo(localStorage.getItem('onlineGimboUsername'), localStorage.getItem('response_arybittrack_email'), localStorage.getItem('response_arybittrack_password'), action, RequestID);
      refresh_dashboard = true; 
      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, RequestID);
    });
    $(document).on('click', '.view-button', function() {
      var FormID = $(this).attr('FormID'); 
      var action = "viewReport";
      var ReportFileURL = $(this).attr('ReportFileURL');
      const pdfContainer = document.getElementById('pdf-container');
      $('.view_inspection_report_err').html('');
      var button_group = `
          <a href="${ReportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button btn-outline-primary" FormID=""><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download Pdf</span></a>
          <button type="button" class="btn btn-bd-primary copy-button" FormID="" ReportFileURL="${ReportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy Link</span></button>
      `;
      if (role != "Elite Technician") {
        $('.view-button-modal-footer').html(button_group);
      }


      //alert(ReportFileURL);

      displayPdf(ReportFileURL,pdfContainer);
    });
    $(document).on('click', '.copy-button', function() {      
      var ReportFileURL = $(this).attr('ReportFileURL');
      copyToClipboard(ReportFileURL);
    }); 

    $(document).on('click', '.view-auction-btn', function(e) {
      e.preventDefault();
    
      const vehicleID = $(this).data('vehicleid');
      const title = $(this).data('title');
      const startingBid = $(this).data('startingbid');
      //const timeLeft = $(this).data('timeLeft');
      const timeLeft = $(this).attr('timeLeft');  // ✅ Get attribute value

      let overlayVehicleDetails = `
        <h3>${title}</h3>
        <p><strong>Starting Bid:</strong> ${startingBid}</p>
        <p><strong>Vehicle ID:</strong> ${vehicleID}</p>
        <button class="btn btn-success mt-3">Place Bid</button>
      `;
    
      // Inject Vehicle Details
      $('#overlayVehicleDetails').html(overlayVehicleDetails);
      $('#currentBidAmount').html(`KES ${startingBid}`);
      $('#timeLeft').html(timeLeft);

      // Inject Images/Videos from imagesAuctions array
      let mediaHtml = '';
      let activeSet = false;
    
      imagesAuctions.forEach(image => {
        if (image.VehicleID == vehicleID) {
          if (!activeSet) {
            mediaHtml += `<div class="carousel-item active">`;
            activeSet = true;
          } else {
            mediaHtml += `<div class="carousel-item">`;
          }
          if (isVideoFile(image.ImagePath)) {
            mediaHtml += `<video src="${image.ImagePath}" class="img-fluid" controls></video>`;
          } else {
            mediaHtml += `<img src="${image.ImagePath}" class="img-fluid" alt="${image.Description}">`;
          }
          mediaHtml += `</div>`;
        }
      });
    
      if (mediaHtml === '') {
        mediaHtml = `<div class="carousel-item active">
          <img src="https://via.placeholder.com/800x400?text=No+Media+Available" class="img-fluid">
        </div>`;
      }
    
      $('#overlayVehicleImages').html(mediaHtml);
      $('#auctionOverlay').fadeIn().removeClass('d-none');
    });
    
    $(document).on('click', '.close-overlay', function() {
      $('#auctionOverlay').fadeOut().addClass('d-none');
    });    
    /**$(document).on('click', function(event) {
      if (!$(event.target).closest('#auctionOverlay .overlay-content').length) {
          $('#auctionOverlay').fadeOut().addClass('d-none');
      }
    }); */
  
    // Event delegation for dynamically handling clicks on vehicle images and videos    
    $(document).off('click', '.vehicle-image').on('click', '.vehicle-image', function() {
      var VehicleID = $(this).attr('VehicleID');
      let vehicleImagePath = "";
      let fancyboxImages = []; // Store Fancybox-compatible image/video objects
  
      response_images.forEach(image => {
          if (VehicleID === String(image.VehicleID)) {
              const isVideo = image.ImagePath.endsWith(".mp4") || 
                              image.ImagePath.includes("youtube.com") || 
                              image.ImagePath.includes("vimeo.com");
  
              // Avoid duplicate entries
              const exists = fancyboxImages.some(fancyboxImage => fancyboxImage.src === image.ImagePath);
              if (!exists) {
                  if (isVideo) {
                      fancyboxImages.push({
                          src: `<video controls autoplay muted loop playsinline>
                                  <source src="${image.ImagePath}" type="video/mp4">
                                  Your browser does not support the video tag.
                                </video>`,
                          type: "html",
                          caption: image.Description,
                          customDownloadUrl: image.ImagePath // Custom property for download
                      });

                      //alert(image.Description);
  
                      if (vehicleImagePath === "") {
                          vehicleImagePath = `
                              <a href="${image.ImagePath}" data-fancybox="gallery" data-caption="${image.Description}">
                                  <video src="${image.ImagePath}" poster="${image.Thumbnail || ''}" class="vehicle-thumb" autoplay muted loop playsinline></video>
                              </a>
                          `;
                      } else {
                        vehicleImagePath = `
                            <a href="${image.ImagePath}" data-fancybox="gallery" data-caption="${image.Description}">
                                <video src="${image.ImagePath}" poster="${image.Thumbnail || ''}" class="vehicle-thumb" autoplay muted loop playsinline></video>
                            </a>
                        `;
                      }

                  } else {
                      fancyboxImages.push({
                          src: image.ImagePath,
                          type: "image",
                          caption: image.Description,
                          customDownloadUrl: image.ImagePath
                      });
  
                      vehicleImagePath += `
                          <a href="${image.ImagePath}" data-fancybox="gallery" data-caption="${image.Description}">
                              <img src="${image.ImagePath}" alt="${image.Description}" class="${image.Description === 'Right front' ? '' : 'd-none'}">
                          </a>
                      `;
                  }
              }
          }
      });
  
      // Handle Logbook image if no images/videos were found
      if (fancyboxImages.length === 0) {
          response_requestsVehicles.forEach(vehicle => {
              if (VehicleID === String(vehicle.VehicleID) && vehicle.LogbookFileURL) {
                  fancyboxImages.push({
                      src: vehicle.LogbookFileURL,
                      type: "image",
                      caption: "Logbook photo",
                      customDownloadUrl: vehicle.LogbookFileURL
                  });
  
                  vehicleImagePath = ` 
                      <a href="${vehicle.LogbookFileURL}" data-fancybox="gallery" data-caption="Logbook photo">
                          <img src="${vehicle.LogbookFileURL}" alt="Logbook photo">
                      </a>
                  `;
              }
          });
      }
  
      // **Sort Fancybox images to show videos first**
      fancyboxImages.sort((a, b) => (a.type === "html" ? -1 : 1));
  
      // Update the specific .vehicleImageLogo for the clicked vehicle
      $(`.vehicleImageLogo[VehicleID="${VehicleID}"]`).html(vehicleImagePath);
  
      // Initialize Fancybox v5 with a custom download button
      if (fancyboxImages.length > 0) {
          Fancybox.show(fancyboxImages, {
              Toolbar: {
                  display: {
                      left: [],
                      middle: [],
                      right: ["download", "zoom", "slideshow", "fullscreen", "close"]
                  }
              },
              callbacks: {
                  ready: (fancybox) => {
                      let downloadButton = document.createElement("button");
                      downloadButton.classList.add("fancybox-button", "fancybox-button--download");
                      downloadButton.innerHTML = "⬇️";
                      downloadButton.title = "Download";
                      downloadButton.onclick = () => {
                          let currentSlide = fancybox.getSlide();
                          let downloadUrl = currentSlide.customDownloadUrl || currentSlide.src;
                          let link = document.createElement("a");
                          link.href = downloadUrl;
                          link.setAttribute("download", downloadUrl.split('/').pop());
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                      };
  
                      // Add the download button to Fancybox toolbar
                      fancybox.container.querySelector(".fancybox__toolbar").appendChild(downloadButton);
                  }
              }
          });
      } else {
          showSnackbar("No images or videos found for this vehicle.");
      }
    });  
    
    // Bind the function to both the class and the ID
    $(document).on('click', '.newReport', function(){
      document.querySelectorAll(".resumeReport").forEach(element => {
        element.classList.remove("d-none");
      });
      setupNewReport();
    
    });
    document.getElementById('newReport').addEventListener('click', function(){
      document.querySelectorAll(".resumeReport").forEach(element => {
        element.classList.remove("d-none");
      });
      setupNewReport();
    
    });
    document.getElementById('downloadReport').addEventListener('click', () => {   
      downloadReport(localStorage.getItem('valuationReportUrl'));
    });
    $(document).on('click', '#generateReport', function() {
      $("#generateReport").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...');

      const coordinates = 0.00 + ', ' + 0.00;
      addNetworkEventGenerateReportListener_count = 1;
      document.getElementById('submitReport').disabled = true;
      document.getElementById('newReport').disabled = true;
      document.getElementById('downloadReport').disabled = true;
      document.getElementById('viewReport').classList.add('d-none');
      document.getElementById('submitReport').classList.remove('d-none');
      document.querySelector("#valuationForm").style.display = "none";
      document.querySelector("#report").style.display = "block";
      document.getElementById('report_Content').innerHTML = `<div class="modal-body text-center"> <div class="spinner-border" role="status"> <span class="visually-hidden">Loading...</span> </div> </div>`;
      $('#submitReport').html('Generating Report...<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
      
      setTimeout(() => {
        positionGenerateReport();
      }, 10);
    });
    document.getElementById('submitReport').addEventListener('click', () => {   
      submitReport();
    });
    $('#percentageSlider').on('input', function () {
      var value = $(this).val();
      image_quality = value;
      $('#sliderValue').text(value);
    });
    $(document).ready(() => {
      const inputs = [
          {
              makeInput: $('#individual-vehicle-make'),
              modelInput: $('#individual-vehicle-model'),
              makeSuggestions: $('#makeSuggestions'),
              modelSuggestions: $('#modelSuggestions')
          },
          {
              makeInput: $('#make'),
              modelInput: $('#model'),
              makeSuggestions: $('#vehicleMakeSuggestions'),
              modelSuggestions: $('#vehicleModelSuggestions')
          }
      ];
  
      inputs.forEach(({ makeInput, modelInput, makeSuggestions, modelSuggestions }) => {
          makeInput.on('input', () => {
              showSuggestions(makeInput, makeSuggestions, Object.keys(carData));
          });
  
          modelInput.on('input', () => {
              const selectedMake = makeInput.val();
              if (carData[selectedMake]) {
                  showSuggestions(modelInput, modelSuggestions, carData[selectedMake]);
              }
          });
  
          makeSuggestions.on('click', (e) => {
              e.stopPropagation();
          });
  
          modelSuggestions.on('click', (e) => {
              e.stopPropagation();
          });
      });
  
      // Hide suggestions when clicking outside any input or suggestion list
      $(document).on('click', (e) => {
          if (!$(e.target).closest('.form-control, .suggestions-list').length) {
              $('.suggestions-list').hide();
          }
      });
    });
    $(document).on('click', '.request-valuation-btn', function(event) {
      event.preventDefault();
      const action = "requestValuation"; 
      const form = document.getElementById('submit-valuation-request');
      const formData = new FormData(form);
       
      // File input element
      const logbookPhotoInput = document.querySelector('input[name="logbookPhotoToUpload[]"]');      
      // Validation check
      if (!logbookPhotoInput.files.length) { // Check if file is attached
        showSnackbar("Logbook Photo Required");
        logbookPhotoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        logbookPhotoInput.focus();
      } else if (!formData.get('client-name-request')) {
        showSnackbar("Client Name Required");
        document.getElementById('client-name-request').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('client-name-request').focus();
      } else if (!formData.get('client-contact-request')) {
        showSnackbar("Client Contact Required");
        document.getElementById('client-contact-request').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('client-contact-request').focus();
      } else if (!formData.get('client-contact-request')) {
        showSnackbar("Client Email Required");
        document.getElementById('client-email-request').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('client-email-request').focus();
      } else if (!formData.get('client-kra-request')) {
        showSnackbar("Client KRA Required");
        document.getElementById('client-kra-request').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('client-kra-request').focus();
      } else {
        $(this).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
        // Adding additional data to formData
        formData.append('deviceID', localStorage.getItem('deviceID'));
        formData.append('userEmail', localStorage.getItem('userEmail'));
        formData.append('userPasswordHash', localStorage.getItem('userPasswordHash'));
        formData.append('CompanyID', localStorage.getItem('userCompanyInputID'));
        //alert(localStorage.getItem('userCompanyInputID'));
        //formData.append('CompanyID', 4);        
        formData.append('maessa_up_Arr', maessa_up_Arr);
              
        formData.append('videoChecklistArray', JSON.parse(localStorage.getItem("videoChecklistArray")));

        formData.append('inAppCamera', localStorage.getItem('inAppCamera'));
        formData.append('videoSection', localStorage.getItem('videoSection'));
        formData.append('themePdfColor', localStorage.getItem('themePdfColor'));
        formData.append('themePdfFontSize', localStorage.getItem('themePdfFontSize'));

        formData.append('aiObjectsDetection', localStorage.getItem('aiObjectsDetection'));
        formData.append('aiDamageDetection', localStorage.getItem('aiDamageDetection'));
        formData.append('aiValuePrediction', localStorage.getItem('aiValuePrediction'));
        formData.append('priorityStandard', localStorage.getItem('priorityStandard'));
        formData.append('priorityExpress', localStorage.getItem('priorityExpress'));

        formData.append('action', action);
        addNetworkEventListener_count = 1;
        requestValuation(formData);
      }  

      if (!formData.get('individual-vehicle-make')) {
        //showSnackbar("Vehicle Make Required");
        //document.getElementById('individual-vehicle-make').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('individual-vehicle-make').focus();
        formData.set('individual-vehicle-make', ' ');  // Set default value
      } else if (!formData.get('individual-vehicle-model')) {
        //showSnackbar("Vehicle Model Required");
        //document.getElementById('individual-vehicle-model').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('individual-vehicle-model').focus();
        formData.set('individual-vehicle-model', ' ');  // Set default value
      } else if (!formData.get('individual-vehicle-year')) {
        //showSnackbar("Vehicle Year Required");
        //document.getElementById('individual-vehicle-year').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('individual-vehicle-year').focus();
        formData.set('individual-vehicle-year', '2020');  // Set default value
      } else if (!formData.get('individual-vehicle-mileage')) {
        //showSnackbar("Vehicle Mileage Required");
        //document.getElementById('individual-vehicle-mileage').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('individual-vehicle-mileage').focus();
        formData.set('individual-vehicle-mileage', '0');  // Set default value
      } else if (!formData.get('valuationType')) {
        //showSnackbar("Valuation Type Required");
        //document.getElementById('valuationType').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('valuationType').focus();
        formData.set('valuationType', 'Standard');  // Set default value
      } else if (!formData.get('industryType')) {
        //showSnackbar("Industry Type Required");
        //document.getElementById('industryType').scrollIntoView({ behavior: 'smooth', block: 'center' });
        //document.getElementById('industryType').focus();
        formData.set('industryType', 'Insurance');  // Set default value
      }  
      

    }); 
    $(document).on("click", ".Captured_Photos", function() {

      const imgAdd = $(this);
      if (compression_complete == 0) {
        captureImage(); 
      } else {
        showSnackbar(inHouseMessage);
      }
      

      function captureImage() {
        var permissions = cordova.plugins.permissions;
        var permissionsToRequest = [
          permissions.CAMERA,
          permissions.READ_EXTERNAL_STORAGE, // Read existing files
          permissions.WRITE_EXTERNAL_STORAGE // Write new files
        ];
        permissions.requestPermissions(permissionsToRequest, function(status) {
          if (status[permissions.CAMERA] === permissions.GRANTED) {
            navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
              quality: Number(image_quality),
              destinationType: Camera.DestinationType.DATA_URL,
              correctOrientation: true // Automatically corrects the orientation of the image
            });
            imgAdd.closest(".col").find('.imgUp').append(`<div class="points-spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`);

          } else {
            showSnackbar('Permissions denied');
          }
        }, function(err) {
          showSnackbar('Permission request failed: ' + JSON.stringify(err));
        });// Function to resize the image to specified dimensions
        
      }

      // Function triggered after capturing an image from the camera
      function onCameraSuccess(imageData) {
        const resizedImageData = imageData.replace(/^data:image\/(jpeg|png);base64,/, '');

        showSnackbar(`<span class="text-success">Analysing ${imgAdd.attr('maessa_up')} image...</span>`);
        $("#upload_from_file_container_help").html(`<span class="text-success">Analysing ${imgAdd.attr('maessa_up')} image...</span>`);
           
        //imgAdd.closest(".col").find('.imgUp').append(`<div class="points-spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`);

        if (localStorage.getItem("aiObjectsDetection") === "true" || localStorage.getItem("requests_aiObjectsDetection") === "true") {

          $.ajax({
            //url: 'https://detect.roboflow.com/infer/workflows/autovaluation/detect-count-and-visualize',
            url: 'https://detect.roboflow.com/infer/workflows/autovaluation/detect-count-and-visualize-3',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                api_key: 'cifxp0cktEBBv8XjLg9l',
                inputs: {
                    "image": { "type": "base64", "value": imageData }
                }
            }),
            success: function(result) {
              if (result && result.outputs && result.outputs[0]) {
                  const outputImage = result.outputs[0].output_image;
                  const countObjects = result.outputs[0].count_objects;
                  const predictions = result.outputs[0].predictions.predictions; // Get the predictions
                  imgAdd.closest(".col").find('.points-spinner-grow').remove();
  
                  // Create a list of predictions
                  const predictionsHTML = predictions.map(prediction => `
                      <li>
                          <strong>Class:</strong> ${prediction.class} <br>
                          <strong>Confidence:</strong> ${(prediction.confidence * 100).toFixed(2)}% <br>
                          <strong>Position:</strong> (${prediction.x}, ${prediction.y}) <br>
                          <strong>Size:</strong> ${prediction.width}x${prediction.height}
                      </li>
                  `).join('');  
  
                  // Modal content
                  const modalContent = `
                  <div id="capturePointsModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true" style="z-index: 99999;">
                    <div class="modal-dialog modal-fullscreen modal-dialog-centered mt-2">
                      <div class="modal-content bg-dark text-light rounded-4 shadow">
                        <div class="modal-header border-bottom border-secondary">
                          <h5 class="modal-title fw-bold" id="modalTitle">Scanning ${imgAdd.attr('maessa_up')}</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body d-flex flex-column justify-content-center align-items-center">
                          <img id="responseImage" src="" alt="Result" class="img-fluid" />
                          <p id="capturePointsModalError" class="text-primary mt-3 text-center fw-semibold">${countObjects} Objects</p>
                          <!-- Removed JSON.stringify for security -->
                          <div>
                            <h6>Predictions:</h6>
                            <ul>${predictionsHTML || '<li>No predictions available.</li>'}</ul>
                          </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-between align-items-center border-top border-secondary">
                          <button type="button" class="btn btn-secondary btn-lg px-4" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-success btn-lg px-4" id="captureButton">Capture</button>
                        </div>
                      </div>
                    </div>
                  </div>`;
          
                  // Append modal to body
                  $("body").append(modalContent);
                  
                  predictions.forEach(prediction => {
                    if (prediction.class === imgAdd.attr('maessa_up')) {                    
                      showSnackbar(`Match found: ${prediction.class} with confidence ${(prediction.confidence * 100).toFixed(2)}%`);
                      $("#upload_from_file_container_help").html(`<span class="text-success">Match found: ${prediction.class} with confidence ${(prediction.confidence * 100).toFixed(2)}%</span>`);
          
                      const maessaUpIndex = uploadedFiles.findIndex(file => file.maessa_up === imgAdd.attr('maessa_up'));
  
                      // Update or add the resized image data to the uploadedFiles array
                      if (maessaUpIndex !== -1) {
                          uploadedFiles[maessaUpIndex].imageData = resizedImageData;
                          uploadedTimeFiles[maessaUpIndex].timestamp = gettimeOfInspection();
                      } else {
                          uploadedFiles.push({ maessa_up: imgAdd.attr('maessa_up'), imageData: resizedImageData });
                          uploadedTimeFiles.push({ maessa_up: imgAdd.attr('maessa_up'), timestamp: gettimeOfInspection() });
                      }

                      var duration = 10;
                      //showSnackbar('<span class="text-info">Initializing a ' + duration + ' seconds ' + imgAdd.attr('maessa_up') + ' video</span>');
                      setTimeout(() => {
                        videoSection(imgAdd,imgAdd.attr('maessa_up'),duration);
                      }, 100);

                    } else {
                      //imgAdd.closest(".col").find('.imgUp').css({ "background-image": "url()" });
  
                      $("#upload_from_file_container_help").html(`<span class="text-danger">${imgAdd.attr('maessa_up')} match not found: ${prediction.class} with confidence ${(prediction.confidence * 100).toFixed(2)}%</span>`);
  
                      $("#capturePointsModalError").html(`<span class="text-danger">${imgAdd.attr('maessa_up')} match not found: ${prediction.class} with confidence ${(prediction.confidence * 100).toFixed(2)}%</span>`);
                      showSnackbar(`<span class="text-danger">${imgAdd.attr('maessa_up')} match not found: ${prediction.class} with confidence ${(prediction.confidence * 100).toFixed(2)}%</span>`);
  
                      // Show modal
                      const modalInstance = new bootstrap.Modal(document.getElementById('capturePointsModal'));
                      modalInstance.show();
              
                      // Set image source
                      $('#responseImage').attr('src', `data:image/png;base64,${outputImage.value}`);
  
                    }
  
                    // Update the background image of the corresponding element
                    const imageSrc = "data:image/jpeg;base64," + resizedImageData;
                    imgAdd.closest(".col").find('.imgUp').css({ "background-image": "url(" + imageSrc + ")" });
                  });
  
                  if (predictions.length < 1) {
                    //imgAdd.closest(".col").find('.imgUp').css({ "background-image": "url()" });
  
                    $("#upload_from_file_container_help").html(`<span class="text-danger">No ${imgAdd.attr('maessa_up')} predictions available.</span>`);
                    showSnackbar(`<span class="text-danger">No ${imgAdd.attr('maessa_up')} predictions available.</span>`);
  
                    // Show modal
                    const modalInstance = new bootstrap.Modal(document.getElementById('capturePointsModal'));
                    modalInstance.show();
            
                    // Set image source
                    $('#responseImage').attr('src', `data:image/png;base64,${outputImage.value}`);
  
                    // Update the background image of the corresponding element
                    const imageSrc = "data:image/jpeg;base64," + resizedImageData;
                    imgAdd.closest(".col").find('.imgUp').css({ "background-image": "url(" + imageSrc + ")" });                  
                  }
  
                  document.getElementById("captureButton").addEventListener("click", () => {
                    const modalElement = document.getElementById('capturePointsModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    modalInstance.hide();
                    captureImage();
                  });
          
              }
            },
            error: function(xhr, status, error) {
                showSnackbar("Error occurred: " + JSON.stringify(xhr));
            }
          });
          
        } else {

          const maessaUpIndex = uploadedFiles.findIndex(file => file.maessa_up === imgAdd.attr('maessa_up'));
  
          // Update or add the resized image data to the uploadedFiles array
          if (maessaUpIndex !== -1) {
              uploadedFiles[maessaUpIndex].imageData = resizedImageData;
              uploadedTimeFiles[maessaUpIndex].timestamp = gettimeOfInspection();
          } else {
              uploadedFiles.push({ maessa_up: imgAdd.attr('maessa_up'), imageData: resizedImageData });
              uploadedTimeFiles.push({ maessa_up: imgAdd.attr('maessa_up'), timestamp: gettimeOfInspection() });
          }
  
          // Update the background image of the corresponding element
          const imageSrc = "data:image/jpeg;base64," + resizedImageData;
          imgAdd.closest(".col").find('.imgUp').css({ "background-image": "url(" + imageSrc + ")" });       
          //imgAdd.closest(".col").find('.points-spinner-grow').remove();

            var duration = 10;
            //showSnackbar('<span class="text-info">Initializing a ' + duration + ' seconds ' + imgAdd.attr('maessa_up') + ' video</span>');
            setTimeout(() => {
              videoSection(imgAdd,imgAdd.attr('maessa_up'),duration);
            }, 100);
   
        }

        
        // Display messages indicating image analysis status
        //$("#upload_from_file_container_help").html(`<span class="text-success">Analysing ${imgAdd.attr('maessa_up')} image...</span>`);
        //showSnackbar(`<span class="text-success">Analysing ${imgAdd.attr('maessa_up')} image...</span>`);
        //$("#upload_from_file_container_help").html(`<span class="text-success">${imgAdd.attr('maessa_up')}</span>`);
        
      }
      
      function onCameraFail(message) {
        $("#upload_from_file_container_help").html('Failed because: ' + message);
      }
    });
    $(document).on("click", ".imgAdd", function() {
      //alert('imgAdd');
      var maessaArray = maessa_up_Arr.split(',');
      if (imgAddcount <= maessaArray.length - 1) {
        var maessa_up = maessaArray[imgAddcount].trim();
        //camera-toggle
        var input_file = `<input type="file" name="fileToUpload[]" class="form-control-file uploadFile img d-none" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
        var labelText = `<label class="choose_photo Captured_Photos" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
        if (camera_toggle == 1) {
          input_file = `<input type="file" name="fileToUpload[]" class="form-control-file uploadFile img d-none" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
          labelText = `<label class="choose_photo" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
        }
        if (maessa_up === 'Logbook photo') {
          input_file = `<input type="file" name="logbookfileToUpload[]" class="form-control-file uploadFile img" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;
          labelText = `<label class="choose_photo" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
        }
        $(this).closest(".row").find('.add-img-imgAdd').before(`
          <div class="col mt-2 add-img-bt-center-container position-relative imgAdd-container-col">
            <div class="card imgUp position-relative">
              <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg del"><i class="fa-solid fa-xmark"></i></i>
              ${labelText}
            </div>
          </div>
        `);
    
        if (imgAddcount === maessaArray.length - 1) {
          $(".imgAdd").parent().hide();
        }
        imgAddcount++;
      } else {
        $(".imgAdd").parent().hide();
      }
    });
    $(document).on("click", "i.del", function() {
      $(this).closest(".col").find('.imgUp').css('background-image', 'none');
      $("#upload_from_file_container_help").html('');
    });
    $(document).on("change",".uploadFile", function(event) {
      var uploadFile = $(this);

      if (compression_complete == 0) {
        uploadFile.closest(".col").find('.imgUp').append(`<div class="points-spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`);

        var maessa_up = uploadFile.attr('data-maessa_up');
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
        if (/^image/.test( files[0].type)){ // only image file  
          const imageFile = event.target.files[0];
          if (imageFile.size > 10000000) {
            $("#upload_from_file_container_help").html('<span class="text-danger">Image file size exceeds the limit (10 MB).</span>');
          } else{
            uploadFile.closest(".col").find('.imgUp').removeClass('d-none');  
            //uploadFile.closest(".col").find('.delimg').removeClass('d-none'); 
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file
            reader.onloadend = function(){ // set image data as background of div
              // The result will be a base64-encoded string 
              var imageData = reader.result.split(',')[1]; // Extract base64 part
              var image_src = "data:image/jpeg;base64," + imageData; // Construct the image src URL
              uploadFile.closest(".col").find('.imgUp').css("background-image", "url("+image_src+")"); 
              const fileName = imageFile.name;
              const specialCharactersRegex = /[^\w\d]+/g;
              const newFileName = fileName.replace(specialCharactersRegex, "");
              uploadFile.closest(".col").find('.delimg').addClass('' + newFileName + '');
              imgAdd_count = imgAdd_count + 1;
      
              // Find if maessa_up exists in the 
              const maessaUpIndex = uploadedFiles.findIndex(file => file.maessa_up === maessa_up);
          
              if (maessaUpIndex !== -1) {
                // If maessa_up exists, update imageData
                uploadedFiles[maessaUpIndex].imageData = imageData;
                uploadedTimeFiles[maessaUpIndex].timestamp = gettimeOfInspection();
                
              } else {
                // If maessa_up doesn't exist, push a new object
                uploadedFiles.push({ maessa_up: maessa_up, imageData: imageData });
                uploadedTimeFiles.push({ maessa_up: maessa_up, timestamp: gettimeOfInspection() });
              }
              
              $("#upload_from_file_container_help").html('<span class="text-success">Analysing ' + maessa_up + ' image...</span>'); 
              showSnackbar('<span class="text-success">Analysing ' + maessa_up + ' image...</span>');
              $("#upload_from_file_container_help").html('<span class="text-success">' + maessa_up + '</span>');
  
              var duration = 10;
              //showSnackbar('<span class="text-info">Initializing a ' + duration + ' seconds ' + maessa_up + ' video</span>');
              setTimeout(() => {
                videoSection(uploadFile,maessa_up,duration);
              }, 100);
              
            }
          }    
        } else {
          $("#upload_from_file_container_help").html('<span class= "text-danger" >only Image files</span>');
        }
      } else {
        showSnackbar(inHouseMessage);
      }
      
    });
    $(document).on("change",".companyLogoFile", function(event) {
      var uploadFile = $(this);
      var files = !!this.files ? this.files : [];
      if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
      if (/^image/.test( files[0].type)){ // only image file  
        const imageFile = event.target.files[0];
        if (imageFile.size > 5000000) {
          $("#upload_uploadCompanyLogo_help").html('<span class="text-danger">Image file size exceeds the limit (5 MB).</span>');
        } else{
          uploadFile.closest(".col").find('.imgUp_logo').removeClass('d-none');  
          uploadFile.closest(".col").find('.delimg_logo').removeClass('d-none'); 
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(files[0]); // read the local file
          reader.onloadend = function(){ // set image data as background of div
            uploadFile.closest(".col").find('.imgUp_logo').css("background-image", "url("+this.result+")"); 
            uploadFile.closest(".card").find('.choose_logo').hide();
            const fileName = imageFile.name;
            const specialCharactersRegex = /[^\w\d]+/g;
            const newFileName = fileName.replace(specialCharactersRegex, "");
            uploadFile.closest(".col").find('.delimg_logo').addClass('' + newFileName + '');
            imgAdd_count = imgAdd_count + 1;
            $("#upload_uploadCompanyLogo_help").html('<span class="text-success">' + imageFile.name + ' Selected</span>');            
          }
        }    
      } else {
        $("#upload_uploadCompanyLogo_help").html('<span class= "text-danger" >only Image files</span>');
      }
    });
    $(document).on("change",".uploadlogbookPhoto", function(event) {
      var uploadFile = $(this);
      var files = !!this.files ? this.files : [];
      if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
      if (/^image/.test( files[0].type)){ // only image file  
        const imageFile = event.target.files[0];
        if (imageFile.size > 5000000) {
          $("#upload_uploadlogbookPhoto_help").html('<span class="text-danger">Image file size exceeds the limit (5 MB).</span>');
        } else{
          uploadFile.closest(".col").find('.imgUp_logbookPhoto').removeClass('d-none');  
          uploadFile.closest(".col").find('.delimg_logbookPhoto').removeClass('d-none'); 
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(files[0]); // read the local file
          reader.onloadend = function(){ // set image data as background of div
            uploadFile.closest(".col").find('.imgUp_logbookPhoto').css("background-image", "url("+this.result+")"); 
            uploadFile.closest(".card").find('.choose_logbookPhoto').hide();
            const fileName = imageFile.name;
            const specialCharactersRegex = /[^\w\d]+/g;
            const newFileName = fileName.replace(specialCharactersRegex, "");
            uploadFile.closest(".col").find('.delimg_logbookPhoto').addClass('' + newFileName + '');
            imgAdd_count = imgAdd_count + 1;
            $("#upload_uploadlogbookPhoto_help").html('<span class="text-success">' + imageFile.name + ' Selected</span>');            
          }
        }    
      } else {
        $("#upload_uploadlogbookPhoto_help").html('<span class= "text-danger" >only Image files</span>');
      }
    });
    $(document).on("change",".uploadHeadLogoPhoto", function(event) {
      var uploadFile = $(this);
      var files = !!this.files ? this.files : [];
      if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
      if (/^image/.test( files[0].type)){ // only image file  
        const imageFile = event.target.files[0];
        if (imageFile.size > 5000000) {
          $("#uploadSignaturePhotoHelp").html('<span class="text-danger">Image file size exceeds the limit (5 MB).</span>');
        } else{
          uploadFile.closest(".col").find('.imgUp_headLogo').removeClass('d-none');  
          uploadFile.closest(".col").find('.delimg_headLogo').removeClass('d-none'); 
          var reader = new FileReader(); // instance of the FileReader
          reader.readAsDataURL(files[0]); // read the local file
          reader.onloadend = function(){ // set image data as background of div
            // The result will be a base64-encoded string 
            var imageData = reader.result.split(',')[1]; // Extract base64 part
            var image_src = "data:image/jpeg;base64," + imageData; // Construct the image src URL
    
            uploadFile.closest(".col").find('.imgUp_headLogo').css("background-image", "url("+image_src+")"); 
            uploadFile.closest(".card").find('.choose_headLogo').hide();
            const fileName = imageFile.name;
            const specialCharactersRegex = /[^\w\d]+/g;
            const newFileName = fileName.replace(specialCharactersRegex, "");
            uploadFile.closest(".col").find('.delimg_headLogo').addClass('' + newFileName + '');
            imgAdd_count = imgAdd_count + 1;
            $("#uploadSignaturePhotoHelp").html('<span class="text-success">' + imageFile.name + ' Selected</span>');
    
            const formData = new FormData();
            var selectedCompanyID = localStorage.getItem('userCompanyID');
        
            // Find the selected company in the companies array
            var selectedCompany = companies.find(function(company) {
              return company.CompanyID == selectedCompanyID;
            });
        
            var CompanyName = "";
            if (selectedCompany) {
              CompanyName = selectedCompany.CompanyName;
            }
        
            // Generate the file name
            let file_Name = CompanyName + '_headlogo';
            file_Name = file_Name.replace(/\s+/g, '_').toLowerCase() + ".jpg";
        
            // Create a JSON object with the base64 data
            const metadata = {
              imageData: imageData  // Only take the base64 part
            };
            $("#uploadSignaturePhotoHelp").html('<span class="text-success">' + file_Name + ' Selected</span>');
    
            // Convert to a JSON string and create a Blob
            const jsonString = JSON.stringify(metadata);
            const jsonBlob = new Blob([jsonString], { type: 'application/json' });
            formData.append('signature[]', jsonBlob, file_Name);
            formData.append('deviceID', localStorage.getItem('deviceID'));
            formData.append('userCompanyID', localStorage.getItem('userCompanyID'));
            formData.append('userRole', localStorage.getItem('userRole'));
            formData.append('action', "newHeadLogo");
            savePdfSettings(formData);//maessa_up_Arr
            
          }
        }    
      } else {
        $("#uploadSignaturePhotoHelp").html('<span class= "text-danger" >only Image files</span>');
      }
    });
    $(document).on("click", "i.del_company_logo" , function() {
      $(this).parent().remove();
      $("#companyLogoId").html(` 
      <div class="card imgUp_logo imgUp position-relative">
        <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg_logo del_company_logo d-none"><svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-x-lg"></use></svg></i>
        <label class="choose_logo">Company Logo <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> <input type="file" name="fileToUpload[]" class="form-control-file uploadCompanyLogo img" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;"></label>
      </div>`);
      $("#upload_uploadCompanyLogo_help").html('');
    });
    $(document).on("click", "i.delimg_headLogo" , function() {
      $(this).parent().remove();
      $("#headLogoPhotoId").html(`
        <div class="card imgUp_headLogo imgUp position-relative">
          <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg_headLogo del_headLogo"><i class="fa-solid fa-xmark"></i></i>
          <label class="choose_headLogo">Head Logo Photo <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> <input type="file" name="headLogoPhotoToUpload[]" class="form-control-file uploadHeadLogoPhoto img" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;"></label>
        </div>
      `);
      $("#uploadSignaturePhotoHelp").html('');
    });
    $(document).on("click", "i.del_logbookPhoto" , function() {
      $(this).parent().remove();
      $("#logbookPhotoId").html(` 
      <div class="card imgUp_logbookPhoto imgUp position-relative">
        <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg_logbookPhoto del_logbookPhoto"><i class="fa-solid fa-xmark"></i></i>
        <label class="choose_logbookPhoto">Logbook Photo <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> <input type="file" name="logbookPhotoToUpload[]" class="form-control-file uploadlogbookPhoto img" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;"></label>
      </div>`);
      $("#upload_uploadlogbookPhoto_help").html('');
    });

    getCompanies(localStorage.getItem('deviceID', '' , ''));
    // Delegate click event to dynamically added .selected-company elements
    function handleCompanyInput(inputSelector, listGroupSelector) {
      $(inputSelector).on('input', function() {
          var input = $(this).val().toLowerCase();
          var companyListGroup = $(listGroupSelector);
    
          if (input.length > 2) {
              // Filter companies based on user input
              var filteredCompanies = companies.filter(function(company) {
                  return company.CompanyName.toLowerCase().includes(input);
              });
    
              // Clear existing list items
              companyListGroup.empty();
    
              if (filteredCompanies.length > 0) {
                  // Populate the list with filtered companies
                  filteredCompanies.forEach(function(company) {
                      var listItem = $('<li class="list-group-item d-flex justify-content-between align-items-start selected-company" CompanyID="' + company.CompanyID + '"></li>');
    
                      var logoContainer = $('<span class="logo CompanyLogo me-3"></span>');
                      var logoImg = $('<img>').attr('src', company.CompanyLogo || 'img/default-logo.png').attr('alt', 'Logo').css({width: '40px', height: '40px'});
                      logoContainer.append(logoImg);
    
                      var itemContent = $('<div class="ms-2 me-auto"></div>');
                      var subheading = $('<div class="fw-bold"></div>').text(company.CompanyName);
                      var contentText = 'Address: ' + company.CompanyAddress;
    
                      itemContent.append(subheading);
                      itemContent.append(contentText);
    
                      var badge = $('<span class="badge text-bg-primary rounded-pill"></span>').text(company.Rating);
    
                      listItem.append(logoContainer);
                      listItem.append(itemContent);
                      listItem.append(badge);
    
                      companyListGroup.append(listItem);
                  });
    
                  // Add click event to each list item
                  companyListGroup.find('.selected-company').on('click', function() {
                      // Add custom logic when a company is selected
                      var selectedCompanyID = $(this).attr('CompanyID');                
                      localStorage.setItem('userCompanyInputID', selectedCompanyID);
                  
                      // Find the selected company in the companies array
                      var selectedCompany = companies.find(function(company) {
                          return company.CompanyID == selectedCompanyID;
                      });
  
                      // If a matching company is found, set the input values
                      if (selectedCompany) {
                          $('#valuer-companyname').val(selectedCompany.CompanyName);
                          $('#valuation-companyname').val(selectedCompany.CompanyName);
                          $('#valuer-companyRegistrationNumber').val(selectedCompany.CompanyRegistrationNumber);
                          $('.select-company-list-group').empty(); // Clear suggestions after selection
                          document.querySelector(".employee-number").classList.remove("d-none");
                      }
                      companyListGroup.empty(); // Clear suggestions after selection
                  });
              } else {
                  // No companies found, show a message
                  companyListGroup.append('<li class="list-group-item text-muted">No matching companies found.</li>');
              }
          } else {
              companyListGroup.empty(); // Clear suggestions if input is short
          }
      });
    }
    
    // Call the function for both inputs
    handleCompanyInput('#valuer-companyname', '.select-company-list-group');
    handleCompanyInput('#valuation-companyname', '.select-valuation-company-list-group');

    var corporateRefNo = generateCorporateRefNo();
    var serialNo = generateSerialNo();
    localStorage.setItem('corporateRefNo',corporateRefNo);
    localStorage.setItem('FormID',0);
    localStorage.setItem('userCompanyName',"");
    localStorage.setItem('inspectVehicleID',0);
    localStorage.setItem('serialNo',serialNo);
    document.getElementById('corporateRefNo').value = corporateRefNo;
    document.getElementById('serialNo').value = serialNo;

    const switchCheckbox = document.getElementById("flexSwitchCheckChecked");
    const cameraFlexSwitchCheckChecked = document.getElementById("cameraFlexSwitchCheckChecked");
    const cameraLabel = document.querySelector(".camera-form-check-label");
    // Initial mode
    if (cameraFlexSwitchCheckChecked.checked) {
      switchToCameraMode();
    } else {
      switchToFileMode();
    }

    // Event listener for the switch
    cameraFlexSwitchCheckChecked.addEventListener("change", function() {
      if (this.checked) {
        switchToCameraMode();
      } else {
        switchToFileMode();
      }
    });

    const label = document.querySelector(".form-check-label");
    // Function to switch all classes from dark to light mode
    function switchToLightMode() {
        document.querySelectorAll(".bg-dark").forEach(element => {
            element.classList.remove("bg-dark");
            element.classList.add("bg-light");
        });
        document.querySelectorAll(".text-light").forEach(element => {
            element.classList.remove("text-light");
            element.classList.add("text-dark");
        });
        label.textContent = "Dark mode";
    }
    // Function to switch all classes from light to dark mode
    function switchToDarkMode() {
        document.querySelectorAll(".bg-light").forEach(element => {
            element.classList.remove("bg-light");
            element.classList.add("bg-dark");
        });
        document.querySelectorAll(".text-dark").forEach(element => {
            element.classList.remove("text-dark");
            element.classList.add("text-light");
        });
        label.textContent = "Light mode";
    }
    function switchToCameraMode() {
      camera_toggle = 0;
      cameraLabel.textContent = "Camera Mode";
      $('#vehiclePhotos').html(``);
    
      if (inspect_action != "") {
        inspecVehiclePhotosInput(localStorage.getItem('inspectVehicleID'));
      } else {
    
    
        vehiclePhotosInput(localStorage.getItem('FormID'));
      }
    }
    function switchToFileMode() {
      if (localStorage.getItem("inAppCamera") === "true" || localStorage.getItem("requests_inAppCamera") === "true") {
        cameraFlexSwitchCheckChecked.checked = true; // Use boolean `true` instead of string `'true'`
        showSnackbar('Only in App Camera allowed');
      } else {
        camera_toggle = 1;
        cameraLabel.textContent = "File Mode";
      }

      $('#vehiclePhotos').html(``);
      if (inspect_action != "") {
        inspecVehiclePhotosInput(localStorage.getItem('inspectVehicleID'));
      } else {
        vehiclePhotosInput(localStorage.getItem('FormID'));
      }        
    }
    // Initial mode
    if (switchCheckbox.checked) {
        switchToLightMode();
    } else {
        switchToDarkMode();
    }
    // Event listener for the switch
    switchCheckbox.addEventListener("change", function() {
        if (this.checked) {
            switchToLightMode();
        } else {
            switchToDarkMode();
        }
    }); 

    // Event listener for color picker
    document.getElementById('colorPicker').addEventListener('input', function() {
      const newColor = this.value;
      localStorage.setItem('themeColor',newColor);
      changeBackgroundColor(localStorage.getItem('themeColor'));
      getCompanies(localStorage.getItem('deviceID'),localStorage.getItem('userCompanyID'),localStorage.getItem('themeColor'));
    });

    // Use a MutationObserver to detect dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Apply the color changes to any newly added elements
                //changeBackgroundColor(localStorage.getItem('themeColor'));
                if (switchCheckbox.checked) {
                  switchToLightMode();
                } else {
                  switchToDarkMode();
                }
              }
        });
    });
  
    // Observe the body for any DOM changes
    observer.observe(document.body, {
        childList: true, // Detect new child elements
        subtree: true    // Detect changes in all descendant nodes
    });

    changeBackgroundColor(localStorage.getItem('themeColor'));
    
    drawSignatureCanvas();

    let isScrolling;
    
    $(window).on('scroll', function() {
        // Detect scrolling start
        //showSnackbar('User is scrolling...');
        refresh_dashboard = false;
    
        // Clear the timeout on every scroll event to reset the detection of scroll stop
        clearTimeout(isScrolling);
    
        // Set a timeout to detect when the user stops scrolling (200ms after the last scroll event)
        isScrolling = setTimeout(function() {
          refresh_dashboard = true;
    
            //showSnackbar('User stopped scrolling.');
        }, 2000);  // Adjust the delay time to your preference
    });
    //alert("valuationForm");

    const valuationForm = document.getElementById("valuationForm");

    // Save form data to local storage
    valuationForm.addEventListener("input", () => {
      const formData = {};
      const elements = valuationForm.elements;
  
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].name) {
          formData[elements[i].name] = elements[i].value;
        }
      }
  
      localStorage.setItem("valuationFormData", JSON.stringify(formData));
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

    });
    //alert("localStorage");


    //alert("checkNotificationsPermission");

    const notificationsSwitchCheckbox = document.getElementById("notificationsSwitch");
    const notificationsLabel = document.querySelector(".notifications-check-label");
    // Function to check for notifications permission and toggle the switch
    function checkNotificationsPermission() {
        enableNotifications();
    }
    // Function to enable notifications (e.g., Firebase or any other service)
    function enableNotifications() {
        // Call Firebase or another service to enable notifications
        FirebasePlugin.grantPermission(function(hasPermission){   
            // Update the UI based on the permission status
            if (hasPermission) {
                notificationsSwitchCheckbox.checked = true;
                notificationsLabel.textContent = "Notifications (Enabled)";
                notificationsLabel.classList.add("text-success");
                notificationsLabel.classList.remove("text-danger");
            } else {
                notificationsSwitchCheckbox.checked = false;
                notificationsLabel.textContent = "Notifications (Disabled)";
                notificationsLabel.classList.add("text-danger");
                notificationsLabel.classList.remove("text-success");
            }                                
        });
    }
    //alert("disableNotifications");

    // Function to disable notifications
    function disableNotifications() {
        notificationsSwitchCheckbox.checked = false;
        notificationsLabel.textContent = "Notifications (Disabled)";
        notificationsLabel.classList.add("text-danger");
        notificationsLabel.classList.remove("text-success");
        // Call Firebase or another service to disable notifications
    }
    // Event listener to toggle notifications on checkbox change
    document.getElementById("notificationsSwitch").addEventListener("change", function () {
        if (notificationsSwitchCheckbox.checked) {
            // Enable notifications
            enableNotifications();
        } else {
            // Disable notifications
            disableNotifications();
        }
    });    

    function clientBasicAuthenticationForm(formData) { 
      addNetworkEventListener_count = 1; 
      //alert(server_Url +  'authenticate.php');
      $.ajax({
        url: server_Url +  'authenticate.php',
        type: 'POST',
        data: formData,    
        contentType: false,
        processData: false,
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
              if (evt.lengthComputable) {
                  var percentage = Math.floor((evt.loaded / evt.total) * 100);
                  var progressbar = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
                      '<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ' + percentage + '%;">' + percentage + '%</div>' +
                      '</div>';
                  $("#upload_uploadCompanyLogo_help").html(progressbar);
              }
          }, false);
          return xhr;
        },
        success: function (response) {
          $(".login_error").html(JSON.stringify(response));
          $("#upload_uploadCompanyLogo_help").html("");
          addNetworkEventListener_count = 0;
          try {
            timestamp = response.timestamp;
            var deviceType = response.deviceType;
            //alert(deviceType);
    
            if (response.action == "loginUser") {
              document.getElementById("loginUser").innerHTML=`Login`;
              //alert(response.message.success);
              if (response.message.success) {
                $(".login_error").html(`<span class="text-success text-center">${response.messageError}</span>`);
              } else {
                document.querySelector(".landing-page").classList.add("d-none");
                document.querySelector(".login-page").classList.remove("d-none");            
                $(".login_error").html(`<span class="text-danger text-center">${response.messageError}</span>`);
              }            
            } else if (response.action == "registerUser") {
              $('.next-register-button').html('Next');
              document.getElementById("registerValuer").innerHTML="Submit";
              if (response.message.success) {
                $(".register_error").html(`<span class="text-success text-center">${response.messageError}</span>`);
              } else {
                $(".register_error").html(`<span class="text-danger text-center">${response.messageError}</span>`);
              }            
            }
            //alert(response.status);                                         

            if (response.status) {
              var dateObj = new Date(timestamp);
              // Format the date as yyyy-mm-dd
              var formattedDate = dateObj.toISOString().split('T')[0];
              // Format the time as hh:mm
              var formattedTime = dateObj.toTimeString().split(' ')[0].substring(0, 5);      
              // Set the values of the date input fields
              document.getElementById('valuation_Date').value = formattedDate;
              document.getElementById('dateOfInspection').value = formattedDate;
              // Set the value of the time input field
              document.getElementById('inspectionTime').value = formattedTime;
    
              $("#getStartedBtn").html('Get Started');
    
              addNetworkEventListener_count = 1;
              //alert(window.location.hostname == "localhost");

              if(window.location.hostname == "localhost"){
                //alert(window.location.hostname);

                  if (cordova.platformId == "android") {   
                    //alert(window.location.hostname);
                             
                      FirebasePlugin.getToken(
                          function (fcmToken) {
                              localStorage.setItem('fcmToken',fcmToken);
    
                              // On fcmToken load, check the current notification permission status   
                              checkNotificationsPermission();
                          },
                          function (error) {
                              localStorage.setItem('fcmToken','fcmToken');
                          }
                      );                                
                  } else {
                      localStorage.setItem('fcmToken','fcmToken');
                  }

              } else{  
                  localStorage.setItem('fcmToken','fcmToken');
              }
              
              updateDashboard();
              displayChart([12, 19, 9], [5, 3, 2, 6]);
    
              document.querySelector(".landing-page").classList.add("d-none");
              document.querySelector(".report-information").classList.remove("d-none");
              document.querySelector(".landing-page").classList.add("d-none");
              document.querySelector(".login-page").classList.add("d-none");
              document.querySelector(".register-page").classList.add("d-none");
              document.querySelector(".forgot-password-page").classList.add("d-none");
    
              document.querySelectorAll(".login_buttons").forEach(element => {
                element.classList.add("d-none");                
              });
              document.querySelectorAll(".nav-settings").forEach(element => {
                element.classList.remove("d-none");
              });
    
              if (response.message.Role == "Individual") {
                document.getElementById('client-name-request').value = response.message.Username;
                document.getElementById('client-email-request').value = response.message.Email;
              }

              localStorage.setItem('userUsername',response.message.Username);
              localStorage.setItem('userEmail',response.message.Email);
              localStorage.setItem('userPasswordHash',response.message.PasswordHash);
              localStorage.setItem('userPhoneNumber',response.message.PhoneNumber);
              localStorage.setItem('userRole',response.message.Role);
              localStorage.setItem('userCompanyID',response.message.CompanyID);
              localStorage.setItem('userCompanyName',response.CompanyName);
    
              localStorage.setItem('companyEmployeeNumber',response.message.CompanyEmployeeNumber);
            
              document.querySelector(".profileUsername").innerHTML = response.message.Username;
              document.querySelector(".profileEmail").innerHTML = response.message.Email;
    
              $(".profileRole").html(response.message.Role);
    
              if (response.message.Role == "Principal Valuer" || response.message.Role == "Director") {
                document.querySelector(".color-selector").classList.remove("d-none");
              } else {
                document.querySelector(".color-selector").classList.add("d-none");
              }
                      
              // Find the selected company in the companies array
              var selectedCompany = companies.find(function(company) {
                  return company.CompanyID == response.message.CompanyID;
              });
              if (selectedCompany) {
                if (selectedCompany.ThemeColor != null) {
                  localStorage.setItem('themeColor',selectedCompany.ThemeColor);
                  document.getElementById('colorPicker').value = localStorage.getItem('themeColor');
                  changeBackgroundColor(localStorage.getItem('themeColor'));
    
                }            
                var selectedDetails = companyDetails.find(function(details) {
                  return details.CompanyID == response.message.CompanyID;
                });
                if (selectedDetails) {
                  document.getElementById('additionalHeaderInfo').value = selectedDetails.HeadNotes;
                  document.getElementById('additionalBodyInfo').value = selectedDetails.BodyNotes;
                  document.getElementById('additionalFooterInfo').value = selectedDetails.FootNotes;
                  document.getElementById('additionalNotationInfo').value = selectedDetails.NBNotes;

                  maessa_up_Arr = selectedDetails.maessa_up_Arr;

                  localStorage.setItem( 'vehicleSections', JSON.stringify(maessa_up_Arr.split(',').map(name => ({ name: name.trim() }))) );
                  // Load saved settings
                  //document.getElementById("flexSwitchInAppCamera").checked = localStorage.getItem("inAppCamera") === "true";
                  //document.getElementById("30SecondVideoSwitch").checked = localStorage.getItem("videoSection") === "true";

                  
                  //alert(selectedDetails.maessa_up_Arr);
                }            
              } 
              
              const logoElement = document.querySelector(".toast-logo");
    
              if (response.CompanyLogo != '') {
                logoElement.src = response.CompanyLogo;
                document.querySelector(".profile_CompanyLogo").innerHTML = `<img src="${response.CompanyLogo}" alt="Logo">`;
              } else {
                document.querySelector(".profile_CompanyLogo").innerHTML = `<img src="img/logo.png" alt="Logo">`;
              }
              if (response.message.PhoneNumber != '') {
                document.querySelector(".profilePhoneNumber").innerHTML = `Phone Number: <span>${response.message.PhoneNumber}</span>`;//response.message.PhoneNumber;
              }
                                 
              
              if (response.message.CompanyName != '') {
                $(".toast-name").html(response.CompanyName);
                document.querySelector(".profileCompanyName").innerHTML = `Company Name: <span>${response.CompanyName}</span>`;
                //document.querySelector(".companyNameInfo").innerHTML = `${response.CompanyName}`;

                const companyName = response.CompanyName;
                document.getElementById('companyNameInfo').textContent = companyName; 

                // Team Performance Donut Chart
                //teamPerformanceDonutChart('params');

              }
              if (response.message.CompanyEmployeeNumber != '') {
                document.querySelector(".profileCompanyEmployeeNumber").innerHTML = `Company Employee Number: <span>${response.message.CompanyEmployeeNumber}</span>`;
              }
              if (response.message.ApiKey != '') {
                document.querySelector(".profileApiKey").innerHTML = `Api Key: <span>${response.message.ApiKey}</span>`;
              }
    
              refresh_dashboard = true;
              //alert(refresh_dashboard);
              
              onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", ""); 
    
            } else {
              if (response.action == "loginUser") {
                $(".login_error").html(`<span class="text-danger text-center">${response.messageError}</span>`);
                document.getElementById("loginUser").innerHTML=`Login`;
                document.querySelector(".landing-page").classList.add("d-none");
                document.querySelector(".login-page").classList.remove("d-none");            
              } else {
                $(".register_error").html(`<span class="text-danger text-center">${response.messageError}</span>`);
                document.getElementById("registerValuer").innerHTML="Submit";            
              }
            }
          
          } catch(e) {
            if (response.action == "loginUser") {
              //$(".login_error").html(`<span class="text-danger text-center">${response.action} JSON parsing error</span>`);
              //alert(`<span class="text-danger text-center">${response.action} JSON parsing error</span>`);
              document.getElementById("loginUser").innerHTML=`Login`;
              //document.querySelector(".landing-page").classList.add("d-none");
              //document.querySelector(".login-page").classList.remove("d-none");
            } else {
              $(".register_error").html(`<span class="text-danger text-center">${response.action} JSON parsing error</span>`);
              document.getElementById("registerValuer").innerHTML="Submit";          
            }
          }     
        },
        error: function searchError(xhr, err) {
          addNetworkEventListener_count = 0;
          $(".login_error").html(`<span class="text-danger text-center">${JSON.stringify(xhr)}</span>`);
          document.getElementById("loginUser").innerHTML=`Login`;
          document.querySelector(".landing-page").classList.add("d-none");
          document.querySelector(".login-page").classList.remove("d-none");
          $(".register_error").html(`<span class="text-danger text-center">${JSON.stringify(xhr)}</span>`);
          document.getElementById("registerValuer").innerHTML="Submit";
        }
      });
    }
    
    const slider = document.getElementById('storageSlider');
    const storageLabel = document.getElementById('storageAllocLabel');
    const planLabel = document.getElementById('planLabel');
    const priceLabel = document.getElementById('priceLabel');
    const updatePlanButton = document.getElementById('updatePlanButton');
    const storageValLabel = document.getElementById('storageValLabel');

    // Generate the exponential mapping from slider value to storage value
    function calculateStorageValue(sliderValue) {
        // Map the slider value (0-100) to an exponential range between 300 MB and 100 GB
        const minStorage = 500 * 1024 * 1024; // 500 MB in bytes
        const maxStorage = 2 * 1024 * 1024 * 1024; // 100 GB in bytes
        const storageInBytes = minStorage * Math.pow((maxStorage / minStorage), sliderValue / 100);

        const storageInMbs =(storageInBytes / (1024 * 1024)).toFixed(2);

        // Update the button's attributes
        updatePlanButton.setAttribute('storageValue', `${Math.round(storageInMbs)}`);  
        storageData.forEach(record => {
          var totalUsed = parseInt(record.total_storage_used, 10); // Convert to integer
          var maxStorage = storageInMbs;//parseInt(record.maximum_storage, 10); // Convert to integer
          var totalValuations = parseInt(record.total_valuations, 10); // Convert to integer
          
          var totalMaxValuations = Math.round((maxStorage / totalUsed) * totalValuations);
          storageValLabel.textContent = totalMaxValuations + ' valuations';
          
        });  

        //document.querySelector(".loogg").innerHTML = `sliderValue ${sliderValue}  : ${storageInMbs} MB`;       

        // Convert storageInBytes to a human-readable format
        if (storageInBytes >= 1024 * 1024 * 1024) {
            return (storageInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        } else if (storageInBytes >= 1024 * 1024) {
            return (storageInBytes / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
            return (storageInBytes / 1024).toFixed(2) + ' KB';
        }
    }

    // Function to calculate payment based on storage
    function calculatePayment(sliderValue) {
        const storageInBytes = 300 * Math.pow(1024 * 1024, 1) * Math.pow((100 * Math.pow(1024, 3)) / (300 * Math.pow(1024, 2)), sliderValue / 100);
    
        // Map storage ranges to pricing tiers
        if (storageInBytes <= 500 * 1024 * 1024) { // Up to 500 MB
            updatePlanButton.setAttribute('price', 4500);

            return {
                plan: "Bronze",
                price: "Ksh.4,500"
            };
        } else if (storageInBytes <= 2 * 1024 * 1024 * 1024) { // Up to 2 GB
            updatePlanButton.setAttribute('price', 5500);

            return {
                plan: "Silver",
                price: "Ksh.5,500"
            };
        } else if (storageInBytes <= 10 * 1024 * 1024 * 1024) { // Up to 10 GB
            updatePlanButton.setAttribute('price', 7000);

            return {
                plan: "Gold",
                price: "Ksh.7,000"
            };
        } else if (storageInBytes <= 20 * 1024 * 1024 * 1024) { // Up to 20 GB
            updatePlanButton.setAttribute('price', 8000);

            return {
                plan: "Premium",
                price: "Ksh.8,000"
            };
        } else if (storageInBytes <= 50 * 1024 * 1024 * 1024) { // Up to 50 GB
            updatePlanButton.setAttribute('price', 10100);

            return {
                plan: "Enterprise",
                price: "Ksh.10,100"
            };
        } else { // Up to 100 GB
            updatePlanButton.setAttribute('price', 12000);

            return {
                plan: "Enterprise Plus",
                price: "Ksh.12,000"
            };
        }
    }

    // Update the label whenever the slider value changes
    slider.addEventListener('input', function () {
        const storageValue = calculateStorageValue(slider.value);
        const paymentDetails = calculatePayment(slider.value);

        storageLabel.textContent = storageValue;
        planLabel.textContent = `Plan: ${paymentDetails.plan}`;
        priceLabel.textContent = `Price: ${paymentDetails.price}`;

        // Update the button's attributes
        updatePlanButton.setAttribute('plan', paymentDetails.plan);
        //updatePlanButton.setAttribute('price', paymentDetails.price);

        // Display the button if hidden
        if (updatePlanButton.classList.contains('d-none')) {
            updatePlanButton.classList.remove('d-none');
        }
    });
    //alert("updatePlanButton");

    updatePlanButton.addEventListener('click', function () {
      const plan = this.getAttribute('plan');
      const storageValue = this.getAttribute('storageValue');
      const price = this.getAttribute('price');
      //alert(price + ' ' + get_Location.currency_rates);
      var action = "setCompanyPlan";
      refresh_dashboard = true; 
      showSnackbar(`You have chosen ${plan}.`);
      $('#updatePlanModalLabel').html(`${plan}.`);

      // Display the modal
      const qrCodeModal = new bootstrap.Modal(document.getElementById('updatePlanModal'));
      qrCodeModal.show();    

      var PAYPAL_SCRIPT = 'https://www.paypal.com/sdk/js?client-id=AcE-YOABr3SXOgfukZLaMXvjAEmoQblaNOx2kILJe2nedSM1jZqtjWyExdgEyqp-BcnHuybDQrJc-wpf&locale=en_' + get_Location.country_code + '';
                    
      // Create a script element for the PayPal SDK
      var script = document.createElement('script');
      script.setAttribute('src', PAYPAL_SCRIPT);
      // Define a callback function to execute when the PayPal SDK script is loaded
      script.onload = function () {
          // Render PayPal buttons after the script is loaded
          paypal.Buttons({
            style: {
              layout: 'vertical',
              color:  'black',
              shape:  'rect',
              label:  'pay'
            },
            // Sets up the transaction when a payment button is clicked
            createOrder: function(data, actions) {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '' + (price/get_Location.currency_rates).toFixed(2) + '',
                  },
                  locale: 'en_' + get_Location.country_code + '',
                }],
              });
            },
            // Finalize the transaction after payer approval
            onApprove: function(data, actions) {
              return actions.order.capture().then(function(orderData) {
                // Successful capture! For dev/demo purposes:
                var orderData_id = orderData.id;
                var inteent = orderData.intent;
                var status = orderData.status;
                var email_address = orderData.purchase_units[0].payee.email_address;
                var merchant_id = orderData.purchase_units[0].payee.merchant_id;
                var full_name = orderData.purchase_units[0].shipping.name.full_name;
                var transaction = orderData.purchase_units[0].payments.captures[0];
                var transaction_id = transaction.id;
                var transaction_status = transaction.status;
                var transaction_amount = transaction.amount;
                var payer = orderData.payer;
                $('.updatePlanModalError').html('<span>transaction_id : <span class="text-cmp">' + transaction_id + '</span></span><br><span>transaction_status : <span class="text-cmp">' + transaction_status + '</span></span>');
                onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), action, storageValue);
              });
            }
          }).render('.updatePlanModalBody');
      };
       
      // Append the script element to the head of the document
      document.head.appendChild(script);


    });
    
    const tabs = document.querySelectorAll('.tab-pane');
    let currentIndex = 0;

    const switchTab = (index) => {
        if (index >= 0 && index < tabs.length) {
            tabs[currentIndex].classList.remove('show', 'active');
            tabs[index].classList.add('show', 'active');
            currentIndex = index;
            document.querySelectorAll('.nav-link')[currentIndex].click();
        }
    };

    const container = document.getElementById('valuationTabsContent');
    let startX = 0;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    container.addEventListener('touchmove', (e) => {
        const moveX = e.touches[0].clientX - startX;
        if (moveX > 50) {
            switchTab(currentIndex - 1); // Swipe right
        } else if (moveX < -50) {
            switchTab(currentIndex + 1); // Swipe left
        }
    });
    //alert("getCompanies");

    document.getElementById("newReportModal_close").addEventListener("click", function () {
      //alert("Close the modal properly");
      const newReportModal = document.getElementById("newReportModal");
      const modalInstance = bootstrap.Modal.getInstance(newReportModal);
      if (modalInstance) {
        modalInstance.hide();
      }
    
      // Remove modal backdrop and reset body state
      document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";

    });    
    
    $("#checklistModalLabel_close").click(function () {
      //alert("Close the modal properly");
      const checklistModalLabel = new bootstrap.Modal(document.getElementById('checklistModalLabel'));
      checklistModalLabel.hide();
    
      // Remove modal backdrop and reset body state
      document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";

    });
  
    const savedColor = localStorage.getItem('themePdfColor') || '#171716'; 
    if (savedColor) {
        document.querySelectorAll('.text-theme').forEach(el => {
            el.style.color = savedColor;
        });
        document.getElementById('colorPdfPicker').value = savedColor; // Update the color picker UI
    }
    
    // Load saved settings
    document.getElementById("flexSwitchInAppCamera").checked = localStorage.getItem("inAppCamera") === "true";
    document.getElementById("30SecondVideoSwitch").checked = localStorage.getItem("videoSection") === "true";

    //const video = document.getElementById('videoCapturePoints');
    
    //alert("teamPerformanceDonutChart");
    teamPerformanceDonutChart('params');

    // Retrieve form data from local storage and populate form
    if (localStorage.getItem("valuationFormData") != null) {
      document.querySelector(".resumeReport").classList.remove("d-none");
      const savedData = localStorage.getItem("valuationFormData");
      //alert("savedData");
      if (savedData) {
        const formData = JSON.parse(savedData);
        const elements = valuationForm.elements;
        //alert("elements");

        for (let i = 0; i < elements.length; i++) {
          if (elements[i].name && formData[elements[i].name]) {
            elements[i].value = formData[elements[i].name];
          }
        }
      }
      //alert("savedData");

    }

    onValuatorDeviceReady();
}

function getParsedLocalStorage(key) {
  let storedValue = localStorage.getItem(key);
  
  // Ensure the value is neither null nor empty before parsing
  if (storedValue && storedValue !== "null" && storedValue !== "[]") {
      return JSON.parse(storedValue);
  }
  return []; // Return empty array if null or empty
}

function videoSection(imgAdd,mae_ssa_up,dura_tion) {
  var count_maessa_up_Arr = maessa_up_Arr.split(',');
  var maessa_up = mae_ssa_up;
  var duration = dura_tion;

  // Retrieve checklist arrays safely
  let requests_savedVideoChecklist = getParsedLocalStorage("requests_videoChecklistArray");
  let savedVideoChecklist = getParsedLocalStorage("videoChecklistArray");

  if ((localStorage.getItem("videoSection") === "true" || localStorage.getItem("requests_videoSection") === "true") && (count_maessa_up_Arr.length === uploadedFiles.length )) {
    maessa_up = '30 seconds video ' + mae_ssa_up;
    duration = 30;
    videoInitializing();
  } else if ( requests_savedVideoChecklist.includes(maessa_up) || savedVideoChecklist.includes(maessa_up) ) {
    videoInitializing();
  } else {

    imgAdd.closest(".col").find('.points-spinner-grow').remove();   
    $("#upload_from_file_container_help").html('');
   
  }

  function videoInitializing() {
    showSnackbar('<span class="text-info">Initializing a ' + duration + ' seconds ' + maessa_up + ' video</span>');
   
    setTimeout(() => {

      var permissions = cordova.plugins.permissions;
      var permissionsToRequest = [
          permissions.CAMERA,
          permissions.RECORD_AUDIO, // Ensure proper recording permissions
          permissions.READ_EXTERNAL_STORAGE,
          permissions.WRITE_EXTERNAL_STORAGE, // Required for older Android versions
      ];
      
      if (localStorage.getItem("aiObjectsDetection") === "truee") {     
  
        // Check for permissions (if required by your platform, e.g., Cordova)
        permissions.requestPermissions(permissionsToRequest, function (status) {
            if (status[permissions.CAMERA] === permissions.GRANTED) {
  
                openCapturePointsScanner(maessa_up,duration);
            } else {
                showSnackbar('Permissions denied');
                imgAdd.closest(".col").find('.points-spinner-grow').remove();
            }
        }, function (err) {
          showSnackbar('Permission request failed: ' + JSON.stringify(err));
          imgAdd.closest(".col").find('.points-spinner-grow').remove();
          $("#upload_from_file_container_help").html('');

        });
        
      } else {      
        permissions.requestPermissions(permissionsToRequest, function (status) {
            permissions.hasPermission(permissions.CAMERA, function (status) {
                if (status.hasPermission) {
                  captureVideo(maessa_up,duration);
                } else {
                  imgAdd.closest(".col").find('.imgUp').html("Permissions denied");
                  imgAdd.closest(".col").find('.points-spinner-grow').remove();
                  $("#upload_from_file_container_help").html('');
                }
            });
        }, function (err) {
          imgAdd.closest(".col").find('.imgUp').html("Permission request failed: " + JSON.stringify(err));
          imgAdd.closest(".col").find('.points-spinner-grow').remove();
          $("#upload_from_file_container_help").html('');

        });
      }      
    }, 3000);
  }

  function compressVideo(videoPath, maessa_up, callback) {
    const outputPath = videoPath.replace(/\.mp4$/, `_${maessa_up.replace(/ /g, "_")}_compressed.mp4`);
    const ffmpegCommand = `-i ${videoPath} -b:v 800k -preset fast ${outputPath}`;
    //imgAdd.closest(".col").find('.imgUp').html('<span class="text-info">Starting compression...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div></span>');
    compression_complete = 1;
    inHouseMessage = '<span class="text-info">' + maessa_up + ' video compression inprogress...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div></span>';

    window.ffmpeg.exec(ffmpegCommand, function () {
      // Success callback
      setTimeout(() => {
        //imgAdd.closest(".col").find('.imgUp').html('<span class="text-success">Compression successful</span>');
        callback(outputPath);
        compression_complete = 0;
      }, 1000);
    }, function (error) {
      imgAdd.closest(".col").find('.imgUp').html("Compression failed:" + error);
      imgAdd.closest(".col").find('.points-spinner-grow').remove();
      compression_complete = 0;
    },
    function (progress) {
        if (progress && progress.percent) {
            let percentage = Math.round(progress.percent);
            //imgAdd.closest(".col").find('.imgUp').html(`Compressing... ${percentage}%`);
        }
    });
  }
  
  function captureVideo(maessa_up,duration) {
    navigator.device.capture.captureVideo(
        function (mediaFiles) {
            var videoPath = mediaFiles[0].fullPath || mediaFiles[0].localURL; 
            
            compressVideo(videoPath, maessa_up, function (compressedPath) {
                window.resolveLocalFileSystemURL(compressedPath, function (fileEntry) {
                    fileEntry.file(function (file) {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            const blobEntry = new Blob([reader.result], { type: file.type });
          
                            const maessaUpIndex = uploadedVideoFiles.findIndex(file => file.maessa_up === maessa_up);
                
                            if (maessaUpIndex !== -1) {
                                uploadedVideoFiles[maessaUpIndex].blobEntry = blobEntry;
                                uploadedTimeVideoFiles[maessaUpIndex].timestamp = gettimeOfInspection();
                            } else {
                                uploadedVideoFiles.push({ maessa_up: maessa_up, blobEntry: blobEntry });
                                uploadedTimeVideoFiles.push({ maessa_up: maessa_up, timestamp: gettimeOfInspection() });
                            }                    
                            imgAdd.closest(".col").find('.points-spinner-grow').remove();
                            $("#upload_from_file_container_help").html('');
                            playVideo(fileEntry.toURL());
                        };
                        reader.readAsArrayBuffer(file);
                    });
                });
            });
        },
        function (error) {
            imgAdd.closest(".col").find('.imgUp').html("Video capture failed: " + error.code);
            imgAdd.closest(".col").find('.points-spinner-grow').remove();
        },
        { limit: 1, duration: duration }
    );
  }

  function playVideo(videoPath) {
    const safeId = maessa_up.replace(/\s+/g, '_').replace(/[^a-z0-9_\-\.]/gi, '').toLowerCase();

    createVideoContainer(safeId);
    var videoElement = document.getElementById("video_" + safeId + "");
    videoElement.src = videoPath;

    var playPauseBtn = document.getElementById("play_" + safeId + "");
    var playIcon = playPauseBtn.querySelector(".play-icon");
    var pauseIcon = playPauseBtn.querySelector(".pause-icon");
    var retakeIcon = playPauseBtn.querySelector(".retake-icon");

    retakeIcon.addEventListener("click", function () {
      captureVideo(maessa_up,duration);
    });

    playPauseBtn.addEventListener("click", function () {
        if (videoElement.paused) {
            videoElement.play();
            playIcon.classList.add("d-none");
            retakeIcon.classList.add('d-none');
            pauseIcon.classList.remove("d-none");
        } else {
            videoElement.pause();
            retakeIcon.classList.add('d-none');
            playIcon.classList.remove("d-none");
            pauseIcon.classList.add("d-none");
        }
    });

    // Sync button state when video ends or is paused externally
    videoElement.addEventListener('ended', () => {
        retakeIcon.classList.remove('d-none');
        playIcon.classList.add('d-none');
        pauseIcon.classList.add('d-none');
    });
    
    videoElement.addEventListener('pause', () => {
        playIcon.classList.remove('d-none');
        pauseIcon.classList.add('d-none');
        retakeIcon.classList.add('d-none');

    });
    
    videoElement.addEventListener('play', () => {
        playIcon.classList.add('d-none');
        retakeIcon.classList.add('d-none');
        pauseIcon.classList.remove('d-none');
    });        
  }
  
  function openCapturePointsScanner(maessa_up,duration) {
    const videoElement = document.getElementById("videoCapturePoints");
    let savedStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];

    // Check for supported MIME types
    const getSupportedMimeType = () => {
        const mimeTypes = [
            "video/webm; codecs=vp9",
            "video/webm; codecs=vp8",
            "video/webm",
            "video/mp4",
        ];
        for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
                return mimeType;
            }
        }
        return null;
    };

    // Stop the video stream and release resources
    const stopVideoStream = (stream) => {
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    };

    // Start the video stream from the camera
    const startVideoStream = () => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                videoElement.srcObject = stream;
                savedStream = stream;
                videoElement.play();
                startRecording(stream); // Start recording the stream
                loadModel(); // Load the COCO-SSD model for object detection
            })
            .catch(err => {
                $("#capturePointsModalError").html("Failed to access camera: " + err.message);
            });
    };

    // Start recording the video stream
    function startRecording(stream) {
        recordedChunks = [];
        const mimeType = getSupportedMimeType();
        if (!mimeType) {
            $("#capturePointsModalError").html("Your browser does not support recording.");
            return;
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = saveRecordedVideo;
        mediaRecorder.start();
    }

    // Stop the recording
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    }

    // Save the recorded video and replay it
    function saveRecordedVideo() {
        const mimeType = getSupportedMimeType();
        const blob = new Blob(recordedChunks, { type: mimeType });

        // Save the video to media storage
        saveVideoToStorage(blob);

        // Replay the video
        replayVideo(blob);
    }

    // Save the video to media storage
    function saveVideoToStorage(blob) {
        const fileName = `recording_${Date.now()}.${blob.type.split('/')[1]}`; // e.g., recording_1234567890.webm
        const fileURL = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = fileName;
        a.textContent = "Download Video";
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up
        URL.revokeObjectURL(fileURL);
        document.body.removeChild(a);

        $('#capturePointsModalError').html(`Video saved as ${fileName}`);
    }

    // Replay the recorded video in the video element
    function replayVideo(blob) {
        const videoURL = URL.createObjectURL(blob);
        videoElement.src = videoURL;
        videoElement.type = blob.type; // Set the type to match the blob
        videoElement.controls = true;
        videoElement.play()
            .then(() => {
              $('#capturePointsModalError').html("Video playback started successfully.");
            })
            .catch(error => {
                $('#capturePointsModalError').html("Error playing video: " + error.message);
            });
    }

    // Automatically stop recording and release the stream after 30 seconds
    setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            stopRecording();
        }
        if (videoElement.srcObject) {
            stopVideoStream(videoElement.srcObject);
        }
    }, (duration*1000));

    // Load the COCO-SSD model for object detection
    let model;
    const loadModel = async () => {
        $('#capturePointsModalError').html('<span class="text-success">Loading Model!</span>');
        try {
            model = await cocoSsd.load();
            $('#capturePointsModalError').html('<span class="text-success">Model loaded!</span>');
            detectFrame(); // Start detecting objects in the video frames
        } catch (error) {
            $('#capturePointsModalError').html(`Failed to load model: ${error.message}`);
        }
    };

    // Detect objects in the video frames
    let frameCount = 0;
    const detectFrame = async () => {
        if (!videoElement.srcObject) return;
        frameCount++;
        if (frameCount % 10 === 0) { // Process every 10th frame
            if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                try {
                    const predictions = await model.detect(canvas);
                    visualizePredictions(predictions, ctx); // Visualize the detected objects
                } catch (error) {
                    $('#capturePointsModalError').html(`Detection error: ${error.message}`);
                }
            }
        }
        requestAnimationFrame(detectFrame); // Continue detecting frames
    };

    // Visualize the detected objects on the canvas
    const visualizePredictions = (predictions, ctx) => {
        const output = document.getElementById("capturePointsModalError");
        output.innerHTML = "";

        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "red";
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x, y > 10 ? y - 5 : 10);

            const partDetected = document.createElement("div");
            partDetected.innerText = `${prediction.class} - ${Math.round(prediction.score * 100)}%`;
            output.appendChild(partDetected);
        });
    };

    // Start the video stream and recording
    startVideoStream();
  }  
  function createVideoContainer(safeId) {
    //const safeId = maessa_up.replace(/\s+/g, '_').replace(/[^a-z0-9_\-\.]/gi, '').toLowerCase();

    // Create container div
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container position-relative w-100";
    videoContainer.style.maxHeight = "80vh";

    // Create video element
    const videoElement = document.createElement("video");
    videoElement.id = "video_" + safeId + "";
    videoElement.className = "w-100 rounded";
    videoElement.style.maxHeight = "80vh";
    videoElement.style.objectFit = "cover";
    videoElement.autoplay = true;
    videoElement.setAttribute("playsinline", ""); 

    // Create play/pause button
    const playPauseBtn = document.createElement("button");
    playPauseBtn.type = "button";
    playPauseBtn.id = "play_" + safeId + "";
    playPauseBtn.className = "play-pause-btn position-absolute";

    // Create play icon
    const playIcon = document.createElement("span");
    playIcon.className = "play-icon";
    playIcon.innerHTML = "▶";

    // Create pause icon
    const pauseIcon = document.createElement("span");
    pauseIcon.className = "pause-icon d-none";
    pauseIcon.innerHTML = "❚❚";

    // Create retake icon
    const retakeIcon = document.createElement("span");
    retakeIcon.className = "retake-icon d-none";
    retakeIcon.innerHTML = "⟳";

    // Append icons to button
    playPauseBtn.appendChild(playIcon);
    playPauseBtn.appendChild(pauseIcon);
    playPauseBtn.appendChild(retakeIcon);

    // Append video and button to container
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(playPauseBtn);

    imgAdd.closest(".col").find('.imgUp').html(videoContainer);

    // Append container to specified parent element
    /**const parentElement = document.querySelector(parentSelector);
    if (parentElement) {
        parentElement.appendChild(videoContainer);
    } else {
        showSnackbar("Parent element not found!");
    } */

    return videoContainer;
  }

  async function cCompressVideo(videoPath, maessa_up, callback) {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const outputPath = `${maessa_up.replace(/ /g, "_")}_compressed.mp4`;

    // Load video into FFmpeg
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoPath));

    // Run compression
    await ffmpeg.run('-i', 'input.mp4', '-b:v', '800k', '-preset', 'fast', outputPath);

    // Get compressed video
    const data = ffmpeg.FS('readFile', outputPath);
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });

    callback(URL.createObjectURL(compressedBlob));
  }
  function cCaptureVideo(maessa_up, duration) {
    navigator.device.capture.captureVideo(
        function (mediaFiles) {
            const videoPath = mediaFiles[0].fullPath || mediaFiles[0].localURL;

            compressVideo(videoPath, maessa_up, function (compressedPath) {
                playVideo(maessa_up, compressedPath); // Use the compressed video
            });
        },
        function (error) {
            showSnackbar("Video capture failed: " + error.code);
        },
        { limit: 1, duration: duration }
    );
  }
  
}

// Function to display a Team Performance Donut Chart
function teamPerformanceDonutChart(params) {const ctx = document.getElementById('teamChart').getContext('2d');
  teamChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ['John Doe', 'Jane Smith', 'James Brown'],
          datasets: [{
              label: 'Completed Valuations',
              data: [0, 0, 0],
              backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56'],
              hoverOffset: 4
          }]
      },
      options: {
          plugins: {
              legend: {
                  position: 'bottom',
              }
          }
      }
  });  

  var storageCtx = document.getElementById('storageStatusChart').getContext('2d');

  // Example data (You can dynamically update this data based on your server or application state)
  var totalStorageUsed = [0, 0, 0, 0, 0, 0];
  var maximumStorage = [1500, 1500, 1500, 1500, 1500, 1500];
  var totalValuations = [0, 0, 0, 0, 0, 0];
  
  // Create the line chart
  storageStatusChart = new Chart(storageCtx, {
      type: 'line',
      data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [{
              label: 'Total Storage Used (MBs)',
              data: totalStorageUsed,
              borderColor: '#FF5733',  // Line color for Total Storage Used
              backgroundColor: 'rgba(255, 87, 51, 0.2)',  // Fill color for Total Storage Used
              fill: true,  // Enable fill under the line
              tension: 0.4
          },
          {
              label: 'Maximum Storage (MBs)',
              data: maximumStorage,
              borderColor: '#33FF57',  // Line color for Maximum Storage
              backgroundColor: 'rgba(51, 255, 87, 0.2)',  // Fill color for Maximum Storage
              fill: true,
              tension: 0.4
          },
          {
              label: 'Total Valuations',
              data: totalValuations,
              borderColor: '#3357FF',  // Line color for Total Valuations
              backgroundColor: 'rgba(51, 87, 255, 0.2)',  // Fill color for Total Valuations
              fill: true,
              tension: 0.4
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Value'
                  }
              },
              x: {
                  title: {
                      display: true,
                      text: 'Month'
                  }
              }
          },
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                      }
                  }
              }
          }
      }
  });
  
}

// Function to dynamically update chart
function updateChartTeamPerformance(newData, newLabels, newColors) {
  teamChart.data.labels = newLabels;
  teamChart.data.datasets[0].data = newData;
  teamChart.data.datasets[0].backgroundColor = newColors;
  teamChart.update();
}
// Example function to update the chart dynamically with new data
function updateStorageChartData(newStorageUsed, newMaxStorage, newValuations, newLabels) {
  //alert(newStorageUsed + " updatedMaxStorage " + newMaxStorage + " updatedValuations " + newValuations + " newLabels " + newLabels);

  storageStatusChart.data.labels = newLabels;
  //alert(newStorageUsed + " updatedMaxStorage " + newMaxStorage + " updatedValuations " + newValuations + " newLabels " + newLabels);


  storageStatusChart.data.datasets[0].data = newStorageUsed;
  storageStatusChart.data.datasets[1].data = newMaxStorage;
  storageStatusChart.data.datasets[2].data = newValuations;
  storageStatusChart.update();
}

function resizeImage(base64Str, maxWidth = 500, maxHeight = 500, format = 'image/jpeg', quality = Number(image_quality/100)) {
  return new Promise((resolve, reject) => {
      const img = new Image();
      let processed = false;  // Prevent double processing
 
      // Add prefix if missing
      if (!base64Str.startsWith("data:image/")) {
          base64Str = `data:image/jpeg;base64,${base64Str}`;
      }

      img.src = base64Str;

      img.onload = () => {
          if (!processed) {
              handleResize(img);
          }
      };

      img.onerror = () => {
          reject(new Error("Failed to load image for resizing. Check the base64 string."));
      };

      // Use decode() for smoother handling
      img.decode().then(() => {
          if (!processed) {
              handleResize(img);
          }
      }).catch(() => {
          if (!processed) {
              handleResize(img);  // Fallback to onload
          }
      });

      function handleResize(img) {
          processed = true;  // Ensure resizing only happens once
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Maintain aspect ratio
          if (width > height) {
              if (width > maxWidth) {
                  height *= maxWidth / width;
                  width = maxWidth;
              }
          } else {
              if (height > maxHeight) {
                  width *= maxHeight / height;
                  height = maxHeight;
              }
          }

          // Double scale for higher quality
          canvas.width = width * 2;
          canvas.height = height * 2;

          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width * 2, height * 2);

          // Scale down to final size
          canvas.width = width;
          canvas.height = height;

          // Clear canvas before downscaling
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);

          try {
              const resizedBase64 = canvas.toDataURL(format, quality).replace(/^data:image\/(jpeg|png);base64,/, '');
              resolve(resizedBase64);
          } catch (error) {
              reject(new Error("Failed to resize image: " + error.message));
          }
      }
  });
}
function vehiclePhotosInput(FormID) {
  //alert('drawSignatureCanvas');

  const maessaArray = maessa_up_Arr.split(',');

  var companyName = localStorage.getItem('userCompanyName');  
  
  // Replace spaces with underscores and convert to lowercase
  let targetDir = companyName.replace(/ /g, '_').toLowerCase();
  targetDir = 'arybit_' + targetDir;  
  //alert('drawSignatureCanvas');
    
  // Convert the company name to lowercase and replace spaces with underscores for the file name
  let fileName = companyName.replace(/ /g, '_').toLowerCase();
  fileName += "_logo.jpg"; // Add the ".jpg" extension
  
  var companyLogoUrl = storage_server + targetDir + '/' + fileName;
  //alert('drawSignatureCanvas');


  imgAddcount = 0;
  imgAdd_count = 0;
  imgDetect_count = 0;
  var image_ImagePath = '';
  maessaArray.forEach(function(item) {
    if (FormID !=0) {
    
      var input_file = `<input type="file" name="fileToUpload[]" data-url="${companyLogoUrl}" class="form-control-file uploadFile img d-none" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
      var labelText = `<label class="choose_photo Captured_Photos" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
      if (camera_toggle == 1) {
        input_file = `<input type="file" name="fileToUpload[]" data-url="${companyLogoUrl}" class="form-control-file uploadFile img d-none" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
        labelText = `<label class="choose_photo" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
      }
      image_ImagePath = '';
      response_reports.forEach(report => {
        if (report.FormID == FormID) {

          //alert(response_images.length + ' item ' + item);

          response_images.forEach(image => {
            //alert('report.ReportID ' + report.ReportID + ' image.ReportID ' + image.ReportID + ' FormID' + FormID);

            if (report.VehicleID == image.VehicleID) {

              if (image.Description == item) {
                image_ImagePath = image.ImagePath;
                input_file = `<input type="file" name="fileToUpload[]" data-url="${image.ImagePath}" class="form-control-file uploadFile img" data-maessa_up="${image.Description}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
                labelText = `<label class="choose_photo" maessa_up="${image.Description}"> ${image.Description} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
                if (camera_toggle == 0) {
                  input_file = `<input type="file" name="fileToUpload[]" data-url="${image.ImagePath}" class="form-control-file uploadFile img d-none" data-maessa_up="${image.Description}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
                  labelText = `<label class="choose_photo Captured_Photos" maessa_up="${image.Description}"> ${image.Description} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
                }
              }
            }
          });
          if (item === 'Logbook photo') {
            response_vehicles.forEach(vehicle => {
              if (report.VehicleID == vehicle.VehicleID) {
                image_ImagePath = vehicle.LogbookFileURL;
                //alert(vehicle.BodyType);
                $("#gearBox").val(vehicle.Transmission);
                $("#bodyType").val(vehicle.BodyType);
                input_file = `<input type="file" name="logbookfileToUpload[]" data-url="${vehicle.LogbookFileURL}" class="form-control-file uploadFile img" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;
                labelText = `<label class="choose_photo" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
              }
            });
          }
        }
      });
      

      $('#vehiclePhotos').append(`
        <div class="col mt-2 add-img-bt-center-container position-relative imgAdd-container-col">
          <div class="card imgUp position-relative" style="background-image: url('${image_ImagePath}');">
            <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg del"><i class="fa-solid fa-xmark"></i></i>
            ${labelText}
          </div>
        </div>
      `);

    } else {

      if (imgAddcount <= maessaArray.length - 1) {
        var maessa_up = maessaArray[imgAddcount].trim();

        var input_file = `<input type="file" name="fileToUpload[]" class="form-control-file uploadFile img d-none" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
        var labelText = `<label class="choose_photo Captured_Photos" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
        if (camera_toggle == 1) {
          input_file = `<input type="file" name="fileToUpload[]" class="form-control-file uploadFile img d-none" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
          labelText = `<label class="choose_photo" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
        }
        if (maessa_up === 'Logbook photo') {
          input_file = `<input type="file" name="logbookfileToUpload[]" class="form-control-file uploadFile img" data-maessa_up="${maessa_up}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;
          labelText = `<label class="choose_photo" maessa_up="${maessa_up}"> ${maessa_up} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
        }

        $('#vehiclePhotos').append(`
          <div class="col mt-2 add-img-bt-center-container position-relative imgAdd-container-col">
            <div class="card imgUp position-relative">
              <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg del"><i class="fa-solid fa-xmark"></i></i>
              ${labelText}
            </div>
          </div>
        `);
    
        if (imgAddcount === maessaArray.length - 1) {
          $(".imgAdd").parent().hide();
        }
        imgAddcount++;
      } else {
        $(".imgAdd").parent().hide();
      }
    } 
  });    
  

}
function inspecVehiclePhotosInput(VehicleID) {
  const maessaArray = maessa_up_Arr.split(',');
  response_requestsVehicles.forEach(vehicle => {
    if (vehicle.VehicleID == VehicleID) {
  
      imgAddcount = 0;
      imgAdd_count = 0;
      imgDetect_count = 0;
      var image_ImagePath = '';

      var companyName = localStorage.getItem('userCompanyName');  

      // Replace spaces with underscores and convert to lowercase
      let targetDir = companyName.replace(/ /g, '_').toLowerCase();
      targetDir = 'arybit_' + targetDir;          
      // Convert the company name to lowercase and replace spaces with underscores for the file name
      let fileName = companyName.replace(/ /g, '_').toLowerCase();
      fileName += "_logo.jpg"; // Add the ".jpg" extension
      
      var companyLogoUrl = storage_server + targetDir + '/' + fileName;

      maessaArray.forEach(function(item) {                
        var input_file = `<input type="file" name="fileToUpload[]" data-url="${companyLogoUrl}" class="form-control-file uploadFile img d-none" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
        var labelText = `<label class="choose_photo Captured_Photos" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
        if (camera_toggle == 1) {
          input_file =  `<input type="file" name="fileToUpload[]" data-url="${companyLogoUrl}" class="form-control-file uploadFile img d-none" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
          labelText =  `<label class="choose_photo" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;    
        }

        image_ImagePath = '';
        response_images.forEach(image => {
          if (vehicle.VehicleID == image.VehicleID) {
            if (image.Description == item) {
              image_ImagePath = image.ImagePath;
              input_file = `<input type="file" name="fileToUpload[]" data-url="${image.ImagePath}" class="form-control-file uploadFile img" data-maessa_up="${image.Description}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;    
              labelText = `<label class="choose_photo" maessa_up="${image.Description}"> ${image.Description} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
              if (camera_toggle == 0) {
                input_file = `<input type="file" name="fileToUpload[]" data-url="${image.ImagePath}" class="form-control-file uploadFile img d-none" data-maessa_up="${image.Description}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;" disabled>`;    
                labelText = `<label class="choose_photo Captured_Photos" maessa_up="${image.Description}"> ${image.Description} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
              }
            }
          }
        });

        //alert(response_images.length);

        response_vehicles.forEach(vehicles => {
          if (vehicle.VehicleID == vehicles.VehicleID) {
            $("#gearBox").val(vehicles.Transmission);
            $("#bodyType").val(vehicles.BodyType);}
        });

        if (item === 'Logbook photo') {
          image_ImagePath = vehicle.LogbookFileURL;
          input_file = `<input type="file" name="logbookfileToUpload[]" data-url="${image_ImagePath}" class="form-control-file uploadFile img" data-maessa_up="${item}" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;">`;
          labelText = `<label class="choose_photo" maessa_up="${item}"> ${item} <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> ${input_file}</label>`;
        } 
        //alert(image_ImagePath + ' item ' + item);
        $('#vehiclePhotos').append(`
          <div class="col mt-2 add-img-bt-center-container position-relative imgAdd-container-col">
            <div class="card imgUp position-relative" style="background-image: url('${image_ImagePath}');">
              <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg del"><i class="fa-solid fa-xmark"></i></i>
              ${labelText}
            </div>
          </div>
        `);
      });          
    }
  });
}
function getLocation(permissions) {
  permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
    if (status.hasPermission) {
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
            if (status.hasPermission) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true });
              } else {
                showSnackbar('<p class="text-danger">Geolocation is not supported by this browser.</p>');
              }
            } else {
                showSnackbar('<p class="text-danger">Location permission denied.</p>');
            }
        }, function() {
            showSnackbar('<p class="text-danger">Location permission request failed.</p>');
        });
    } else {
        permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
            if (status.hasPermission) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError, { enableHighAccuracy: true });
              } else {
                showSnackbar('<p class="text-danger">Geolocation is not supported by this browser.</p>');
              }
            } else {
                showSnackbar('<p class="text-danger">Location permission denied.</p>');
            }
        }, function() {
            showSnackbar('<p class="text-danger">Location permission request failed.</p>');
        });
    }
  }, function() {
    showSnackbar('<p class="text-danger">Checking location permission failed.</p>');
  });      
}
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const altitude = position.coords.altitude;
  const accuracy = position.coords.accuracy;
  const altitudeAccuracy = position.coords.altitudeAccuracy;
  const heading = position.coords.heading;
  const speed = position.coords.speed;
  const timestamp = position.timestamp;
  const coordinates = latitude + ', ' + longitude;
  //positionGenerateReport(coordinates);
}
function showError(error) {
  switch (error.code) {
      case error.PERMISSION_DENIED:
          showSnackbar('<p class="text-danger">User denied the request for Geolocation.</p>');
          break;
      case error.POSITION_UNAVAILABLE:
          showSnackbar('<p class="text-danger">Location information is unavailable.</p>');
          break;
      case error.TIMEOUT:
          showSnackbar('<p class="text-danger">The request to get user location timed out.</p>');
          break;
      case error.UNKNOWN_ERROR:
          showSnackbar('<p class="text-danger">An unknown error occurred.</p>');
      break;
  }
}
function savePdfSettings(formData) {
  $.ajax({
    url: server_Url +  'savePdfSettings.php',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          var percentage = Math.floor((evt.loaded / evt.total) * 100);
          var progressbar = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ' + percentage + '%;">' + percentage + '%</div>' +
            '</div>';
          $("#uploadSignaturePhotoHelp").html(progressbar);
        }
      }, false);
      return xhr;
    },
    success: function(response) {
      if (response.status) {

        //alert(response.message);

        $("#uploadSignaturePhotoHelp").html(`<span class="text-success">${response.message} </span>`);
        document.querySelector(".signature-button-group").classList.add("d-none");

        showSnackbar('Settings saved successfully!');
        getCompanies(localStorage.getItem('deviceID', '' , ''));
      } else {
        $("#uploadSignaturePhotoHelp").html(`<span class="text-danger">${response.messageError} </span>`);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#uploadSignaturePhotoHelp").html(JSON.stringify(jqXHR));
    }
  });
  
}
function getCompanies(deviceID,companyID,themeColor) {
  $.ajax({
    url: server_Url + 'companies.php',
    method: 'POST', // Keep the HTTP method as POST
    data: {
      deviceID: deviceID,
      companyID: companyID,
      themeColor: themeColor
    },
    dataType: 'json', // Expecting a JSON response
    success: function(response) {
      // Get the companies array from the response
      //alert(JSON.stringify(response.companies));
      
      companies = response.companies;
      companyDetails = response.companyDetails;

      storage_server = response.storage_server;
      //const toastLiveExample = document.getElementById('liveToast');
      //const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      $(".toast-time").html(`${convert_date_to_words(response.timestamp)}`);

      if (response.response.status) {
        
      } else {
        //$(".toast-body").html(`${response.response.messageError}`);
        //toastBootstrap.show(); 
      }  

    },
    error: function(xhr, status, error) {
      //alert(JSON.stringify(xhr));
      showSnackbar(JSON.stringify(xhr));
    }
  });
}
function scrollAndFocusElement(elementId) {
  // Get the element by its ID
  var element = document.getElementById(elementId);

  // Check if the element exists
  if (element) {
      // Scroll the element into view smoothly, centered vertically
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Set focus on the element
      element.focus();
  } else {
      //console.log('Element with id ' + elementId + ' not found.');
  }
}
function requestValuation(formData) {
  addNetworkEventListener_count = 1;
  $.ajax({
    url: server_Url +  'requestValuation.php?q=',
    type: 'POST',
    data: formData,    
    contentType: false,
    processData: false,
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
              var percentage = (evt.loaded / evt.total) * 100;
              var progrebar = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
              '<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ' + percentage + '%;></div>' +
              '</div>';
              $("#upload_uploadlogbookPhoto_help").html(progrebar);
          }
      }, false);
      return xhr;
    },
    success: function (response) {
      addNetworkEventListener_count = 0;
      try {
        $(".request-valuation-btn").html('Submit Request');
        //alert(response.messageError);
        if (response.status) {
          $(".request_valuation_help").html(`<span class="text-success text-center">${response.message}</span>`);

          $("#upload_uploadlogbookPhoto_help").html("");
          document.getElementById('submit-valuation-request').reset();
          $("#logbookPhotoId").html(` 
          <div class="card imgUp_logbookPhoto imgUp position-relative">
              <i class="position-absolute top-0 start-100 translate-middle badge rounded-pill btn btn-bd-primary delimg_logbookPhoto del_logbookPhoto"><i class="fa-solid fa-xmark"></i></i>
              <label class="choose_logbookPhoto">Logbook Photo <br> <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="#bi bi-image-alt"></use></svg> <input type="file" name="logbookPhotoToUpload[]" class="form-control-file uploadlogbookPhoto img" value="Upload Photo" style="width: 0px;height: 0px;overflow: hidden;"></label>
          </div>`);
          $('#request-valuation-modal').modal('hide');
          refresh_dashboard = true; 
          onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", "");
          
        } else {
          $(".request_valuation_help").html(`<span class="text-danger text-center">${response.messageError}</span>`);
        }

      } catch(e) {
        $(".request_valuation_help").html(`<span class="text-danger text-center">JSON parsing error</span>`);
      }
    },
    error: function searchError(xhr, err) {
      addNetworkEventListener_count = 0;
      $(".request_valuation_help").html(`<span class="text-danger text-center">${JSON.stringify(xhr)}</span>`);
      $(".request-valuation-btn").html('Submit Request');
      $("#upload_uploadlogbookPhoto_help").html("");
    }
  });
}
function positionGenerateReport() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const form = document.querySelector('.valuation_Form');
  const formData = new FormData(form);

  const toastLiveExample = document.getElementById('liveToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

  form.querySelectorAll('input[name="fileDataUrls[]"]').forEach(el => el.remove());
  let filesProcessed = 0;
  let imagesHTML = '';
  let imagesHTML2 = '';
  let imagesHTML3 = '';
  var label_name = '';
  let fileImagesHTMLArray = [];
  let fileImagesHTML2Array = [];
  let fileImagesHTML3Array = [];
  let fileImagesHTML = '';
  let fileImagesHTML2 = '';
  let fileImagesHTML3 = '';
  const logbookImages = formData.getAll('logbookfileToUpload[]');
  const imageFiles = formData.getAll('fileToUpload[]');
  const maessaArray = maessa_up_Arr.split(',');

  const createImageHTML = (url, type, label, formData) => {

    const maessaUpTimestamp = uploadedTimeFiles.find(file => file.maessa_up === label)?.timestamp ?? gettimeOfInspection();

    /**resizeImage(uploadedFiles.find(file => file.maessa_up === label)?.imageData).then((resizedImageData) => {
      const maessaUpIndex = uploadedFiles.findIndex(file => file.maessa_up === label);
      uploadedFiles[maessaUpIndex].imageData = resizedImageData;
    }).catch(error => {
        //showSnackbar(`<span class="text-danger">Error resizing image: ${error.message}</span>`);
    }); */

    const commonHTML = `
      <p class="text-size-small text-start"><small>${label}</small></p>
      <p class="text-size-small text-start"><small>${formData.get('valuer')}</small></p>
      <p class="text-size-small text-start"><small>${formData.get('registrationNo')}</small></p>
      <div class="timestamp-wrapper">
        <p class="text-size-small text-end"><small>${maessaUpTimestamp}</small></p>
      </div>`;

    return type === 'logbook' 
      ? `<div class="col p-0 m-0">
           <div class="card text-bg-dark loogbookFormCard" style="background-image: url('${url}')">
             <div class="card-img-overlay">${commonHTML}</div>
           </div>
         </div>`
      : `<div class="col-6 p-0 m-0">
           <div class="card text-bg-dark valuationFormCard" style="background-image: url('${url}')">
             <div class="card-img-overlay">${commonHTML}</div>
           </div>
         </div>`;
  };
  
  var uploadedFilesfilesProcessed = 0;
  for (let index = 0; index < maessaArray.length; index++) {
    const label = maessaArray[index] || 'Unknown';
    uploadedFiles.forEach(fileObj => {
      if (label == fileObj.maessa_up) {
        var image_src = "data:image/jpeg;base64," + fileObj.imageData; 
        var type = 'normal';
        if (fileObj.maessa_up == 'Logbook photo') {
          type = 'logbook';
        }
        const imageHTML = createImageHTML(image_src, type, label, formData);
        if (fileObj.maessa_up == 'Logbook photo') {
          label_name = label_name + ',' + label;
          fileImagesHTML3Array.push({ [label]: imageHTML });
          fileImagesHTML3 += imageHTML;   
        } else {
          if (uploadedFilesfilesProcessed >= 8 && uploadedFilesfilesProcessed < 16) {
            label_name = label_name + ',' + label;
            fileImagesHTML2Array.push({ [label]: imageHTML });
            fileImagesHTML2 += imageHTML;
          } else if (uploadedFilesfilesProcessed <= 8) {
            label_name = label_name + ',' + label;
            fileImagesHTMLArray.push({ [label]: imageHTML });
            fileImagesHTML += imageHTML;
          }
        }
      }
    });  
    uploadedFilesfilesProcessed++;
  } 

  if (action === "editReport" || inspect_action === "submitReport") {
    //$(".toast-body").html(`${action} ${inspect_action} <br>`);

    var processImageURLfilesProcessed = 0;
    inspect_action = "";      
    imagesHTML3 = "";      
    imagesHTML2 = "";      
    imagesHTML = "";

    const processImageURL = (url, type, label) => {
      //alert(processImageURL);

      return new Promise((resolve) => {
        const imageHTML = createImageHTML(url, type, label, formData);
        switch (type) {
          case 'logbook':
              if (label_name.includes(label)) {
                addHiddenFields(url,label);
                imagesHTML3 += getImageHTML(label,fileImagesHTML3Array);
              } else {
                imagesHTML3 += imageHTML;
              }
            break;
          case 'normal':
            if (processImageURLfilesProcessed >= 8 && processImageURLfilesProcessed < 16) {
              if (label_name.includes(label)) {
                addHiddenFields(url,label);
                imagesHTML2 += getImageHTML(label,fileImagesHTML2Array);
              } else {
                imagesHTML2 += imageHTML;
              }
            } else  if (processImageURLfilesProcessed <= 8){
              if (label_name.includes(label)) {
                addHiddenFields(url,label);    
                imagesHTML += getImageHTML(label,fileImagesHTMLArray);
              } else {
                imagesHTML += imageHTML;
              }
            }
            processImageURLfilesProcessed++;
            break;
        }
        resolve();
      });
    };
    const getImageURLFromDataAttribute = (inputName) => {
      return Array.from(document.querySelectorAll(`input[name="${inputName}"]`))
        .map(input => input.dataset.url)
        .filter(url => url);
    };
    const imageFileUrls = getImageURLFromDataAttribute('fileToUpload[]');
    const promisesURLS = imageFileUrls.map((url, index) => {
      const label = maessaArray[index] || 'Unknown';
      //$(".toast-body").append(`${url} ${label} <br>`);

      return processImageURL(url, 'normal', label);
    });
    const logbookFileInputs = document.querySelectorAll('input[name="logbookfileToUpload[]"]');
    logbookFileInputs.forEach(input => {
      const dataUrl = input.getAttribute('data-url');
      //$(".toast-body").append(`logbook ${dataUrl} <br>`);

      promisesURLS.push(processImageURL(dataUrl, 'logbook', 'Logbook photo'));
    });
    
    //$(".toast-body").append(`promisesURLS ${JSON.stringify(promisesURLS)} <br>`);

    Promise.all(promisesURLS).then(() => {
      generateReport(formData, imagesHTML, imagesHTML2, imagesHTML3);
    }).catch((error) => {
      showSnackbar('Error processing images', error);
    });
    //toastBootstrap.show();

  } else {
    
    imagesHTML3 += fileImagesHTML3;
    imagesHTML2 += fileImagesHTML2;
    imagesHTML += fileImagesHTML;
    generateReport(formData, imagesHTML, imagesHTML2, imagesHTML3);
  }
}
function generateReport(formData, imagesHTML = '', imagesHTML2 = '', imagesHTML3 = '') {
  var companyName = localStorage.getItem('userCompanyName'); 
  var userCompanyID = localStorage.getItem('userCompanyID'); 
                  
  // Find the selected company in the companies array
  var selectedCompany = companies.find(function(company) {
      return company.CompanyID == userCompanyID;
  });
  var companyLogo = "/img/logo.png";
  var companyName = "/img/logo.png";
  var headNotes = "/img/logo.png";
  var bodyNotes = "/img/logo.png";
  var footNotes = "/img/logo.png";
  var nBNotes = "/img/logo.png";
  var principalSign = "/img/logo.png";
  var directorSign = "/img/logo.png";
  var headLogo = "/img/logo.png";

  var companyRegistrationNumber = "/img/logo.png";
  var companyAddress = "/img/logo.png";
  var contactEmail = "/img/logo.png";
  var contactPhone = "/img/logo.png";
  
  // If a matching company is found, set the input values
  if (selectedCompany) {
      companyLogo = selectedCompany.CompanyLogo;
      companyName = selectedCompany.CompanyName;
      companyRegistrationNumber = selectedCompany.CompanyRegistrationNumber;
      companyAddress = selectedCompany.CompanyAddress;
      contactEmail = selectedCompany.ContactEmail;
      contactPhone = selectedCompany.ContactPhone;
            
      var selectedDetails = companyDetails.find(function(details) {
        return details.CompanyID == selectedCompany.CompanyID;
      });
      if (selectedDetails) {
        headLogo = selectedDetails.HeadLogo;
        headNotes = selectedDetails.HeadNotes;
        bodyNotes = selectedDetails.BodyNotes;
        footNotes = selectedDetails.FootNotes;
        nBNotes = selectedDetails.NBNotes;
        principalSign = selectedDetails.PrincipalValuerSign;
        directorSign = selectedDetails.DirectorSign;
      } 
  }  

  //const form = document.querySelector('.valuation_Form');
  //const valuation_FormData = new FormData(form);
  //formData.append('examiner', localStorage.getItem('userUsername'));
  //alert(formData.get('valuer'));
  
  /**const avatar = ` <div class="card" style="background-image: url('${headLogo}'); width: 250px; height: 100px; background-size: contain; background-position: center; background-repeat: no-repeat; "></div>`;

  const date = new Date();
  //report_Card_Content
  var reportContent = `<div class="report_Card_Content">`;
  reportContent = reportContent + `
  <div class="card a4-card mb-1">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-auto">
          ${avatar}
        </div>
        <div class="col-6">
          <span class="text-size-header-small">${headNotes}</span><br>
          <span class="text-size-header-small">${companyName} ${companyAddress}<br> TEL: ${contactPhone} ${contactEmail}</span>
        </div>
        <div class="col">
          <div class="qr_code qrrcode"> </div>          
        </div>
      </div>
    </div>
    <div class="card-body text-start p-3">
      <h1><b>${formData.get('make').toUpperCase()} ${formData.get('model').toUpperCase()} ${formData.get('modelType').toUpperCase()} ${formData.get('registrationNo').toUpperCase()} VALUATION REPORT</b></h1>
      <div class="row justify-content-md-center mt-2">
        <div class="col">
          <strong class="text-size-strong">Ref. No.</strong> <span class="text-theme">${formData.get('corporateRefNo')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">SERIAL No</strong> <span class="text-theme">${formData.get('serialNo')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">ISSUED BY</strong> <span class="text-theme">${formData.get('valuer')}</span>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <strong class="text-size-strong">INSURER</strong> <span class="text-theme">${formData.get('insurer')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">EXPIRY DATE</strong> <span class="text-theme">${formData.get('expiryDate')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">POLICY NO.</strong> <span class="text-theme">${formData.get('policyNo')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">CLIENT NAME</strong> <span class="text-theme">${formData.get('clientName')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">CONTACTS</strong> <span class="text-theme">${formData.get('contactNumber')}</span>
        </div>
        <div class="col-5">
          <div class="row">
            <div class="col-5">
              <strong class="text-size-strong">KRA PIN</strong> <span class="text-theme">${formData.get('contactKRA')}</span>
            </div>
            <div class="col-7">
              <strong class="text-size-strong">Email</strong> <span class="text-theme">${formData.get('emaill')}</span>
            </div>          
          </div>
        </div>
      </div>
      <div class="float-start">
            <span class="text-size-strong">${bodyNotes}</span>
      </div><br> 
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">REGISTRATION NO</strong> <span class="text-theme">${formData.get('registrationNo')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">MAKE</strong> <span class="text-theme">${formData.get('make')}</span>
        </div>
        <div class="col-5">
          <div class="row">
            <div class="col-5">
              <strong class="text-size-strong">Model</strong> <span class="text-theme">${formData.get('model')}</span>
            </div>
            <div class="col-7">
              <strong class="text-size-strong">Model TYPE</strong> <span class="text-theme">${formData.get('modelType')}</span>
            </div>          
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">Body Type</strong> <span class="text-theme">${formData.get('bodyType')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">FUEL TYPE</strong> <span class="text-theme">${formData.get('fuelType')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">GEAR BOX</strong> <span class="text-theme">${formData.get('gearBox')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">CHASSIS NO</strong> <span class="text-theme">${formData.get('chassisNo')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">ENGINE NO</strong> <span class="text-theme">${formData.get('engineNo')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">ENGINE RATING</strong> <span class="text-theme">${formData.get('engineRating')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">YEAR OF MANF.</strong> <span class="text-theme">${formData.get('yearOfManf')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">DATE OF REG.</strong> <span class="text-theme">${formData.get('dateOfReg')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">ODOMETER-CURRENT READING</strong> <span class="text-theme">${addCommasToNumber(formData.get('odometerReading'))} ${formData.get('unitSelection')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">Country of Origin</strong> <span class="text-theme">${formData.get('countryOfOrigin')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">COLOUR</strong> <span class="text-theme">${formData.get('colour')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">Tyres</strong> <span class="text-theme">${formData.get('tyres')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">NO OF AIRBAGS</strong> <span class="text-theme">${formData.get('noOfAirbags')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">Anti Theft</strong> <span class="text-theme">${formData.get('antiTheft')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">TYPES OF LIGHTS</strong> <span class="text-theme">${formData.get('typesOfLights')}</span>
        </div>
      </div>
      <div class="row">
        <h6 class="text-size-strong">Coachwork Notes</h6>
        <p class="text-theme">${formData.get('coachworkNotes')}</p>
      
        <h6 class="text-size-strong">Extras</h6>
        <p class="text-theme">${formData.get('extras')}</p>

        <h6 class="text-size-strong">Electrical Notes</h6>
        <p class="text-theme">${formData.get('electricalNotes')}</p>
      
        <h6 class="text-size-strong">Mechanical Notes</h6>
        <p class="text-theme">${formData.get('mechanicalNotes')}</p><br>
        <strong class="text-size-strong">General Condition</strong> <span class="text-theme">${formData.get('generalCondition')}</span>

      </div> 
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">Location of Inspection</strong> <span class="text-theme">${formData.get('locationOfInspection')}</span>
        </div>
        <div class="col">
          <strong class="text-size-strong">Destination</strong> <span class="text-theme">${formData.get('destination')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">Remarks</strong> <span class="text-danger">${formData.get('remarks')}</span>
        </div>
      </div>      
      <div class="row">
        <div class="col">
          <strong class="text-size-strong">NB</strong> <span class="text-danger">${formData.get('remedy')}</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <strong class="text-size-Value">Radio Estimate: </strong> <span class="text-Value">${addCommasToNumber(formData.get('radioEstimate'))} /=</span>
        </div>
        <div class="col">
          <strong class="text-size-Value">Windscreen Estimate: </strong> <span class="text-Value">${addCommasToNumber(formData.get('windscreenEstimate'))} /=</span>
        </div>
      </div>     
      <div class="row">
        <div class="col">
          <strong class="text-size-Value">Market Value: </strong> <span class="text-Value">${addCommasToNumber(formData.get('marketValue'))} /=</span> <span class="text-danger">${convertNumberToWords(formData.get('marketValue'))}, Kenya Shillings Only<span>
        </div>
      </div>     
      <div class="row">
        <div class="col">
          <strong class="text-size-Value">Forced Value: </strong> <span class="text-Value">${addCommasToNumber(formData.get('forcedValue'))} /=</span> <span class="text-danger">${convertNumberToWords(formData.get('forcedValue'))}, Kenya Shillings Only<span>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <strong class="text-size-strong">Valuation Date: </strong> <span class="text-theme">${formData.get('valuation_Date')}</span><br>
          <span class="signaturePng mt-1" style="background-image: url('${principalSign}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; display: block; width: 100%; height: 80px;"></span>
          <strong class="text-size-strong">Principal valuer sign</strong>
        </div>
        <div class="col">
          <strong class="text-size-strong">Examiner</strong> <span class="text-theme">${formData.get('examiner')}</span>
        </div>
        <div class="col-5">
          <strong class="text-size-strong">Instruction Date</strong> <span class="text-theme">${gettimeOfInspection()}</span>
          <span class="signaturePng mt-1" style="background-image: url('${directorSign}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; display: block; width: 50%; height: 80px;"></span>
          <strong class="text-size-strong">Director sign</strong>
        </div>
      </div>    
    </div>
    <div class="card-footer text-body-secondary p-1">
      <div class="float-end text-end">
        <span class="d-block text-start text-size-small mb-0">
          Receipt No. GB${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
        </span>
      </div>
      <div class="float-start text-start d-none">
        <span class="d-block text-start text-danger text-size-small mb-0">
          NB: ${nBNotes}
        </span>
        <span class="d-block text-start text-size-strong mb-0">
          <span>Valuation for</span>: <span>${footNotes}</span>
        </span>
        <span class="d-block text-start text-size-h6 mb-0">
          <span class="text-size-header-small">${companyName} ${companyAddress}  TEL: ${contactPhone} ${contactEmail}</span>
        </span>
      </div>        
    </div> </div>`;
  reportContent = reportContent + `<div class="mb-1 card a4-card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-auto">
          ${avatar}
        </div>
        <div class="col-6">
          <span class="text-size-header-small">${headNotes}</span><br>
          <span class="text-size-header-small">${companyName} ${companyAddress}<br> TEL: ${contactPhone} ${contactEmail}</span>
        </div>
        <div class="col">
          <div class="qr_code qrrcode"> </div>          
        </div>
      </div>
    </div>
    <div class="card-body cardBody" style="padding: 0; margin: 0;">
      <div class="row imagesRow p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML}</div>
    </div>
    <div class="card-footer text-body-secondary p-1">
      <div class="float-end text-end">
        <span class="d-block text-start text-size-small mb-0">
          Receipt No. GB${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
        </span>
      </div>
      <div class="float-start text-start d-none">
        <span class="d-block text-start text-danger text-size-small mb-0">
          NB: ${nBNotes}
        </span>
        <span class="d-block text-start text-size-strong mb-0">
          <span>Valuation for</span>: <span>${footNotes}</span>
        </span>
        <span class="d-block text-start text-size-h6 mb-0">
          <span class="text-size-header-small">${companyName} ${companyAddress}  TEL: ${contactPhone} ${contactEmail}</span>
        </span>
      </div>        
    </div> </div>`;
  if (imagesHTML2 != '') {
    reportContent = reportContent + `<div class="mb-1 card a4-card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-auto">
          ${avatar}
        </div>
        <div class="col-6">
          <span class="text-size-header-small">${headNotes}</span><br>
          <span class="text-size-header-small">${companyName} ${companyAddress}<br> TEL: ${contactPhone} ${contactEmail}</span>
        </div>
        <div class="col">
          <div class="qr_code qrrcode"> </div>          
        </div>
      </div>
    </div>
    <div class="card-body cardBody" style="padding: 0; margin: 0;">
      <div class="row imagesRow p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML2}</div>
    </div>
    <div class="card-footer text-body-secondary p-1">
      <div class="float-end text-end">
        <span class="d-block text-start text-size-small mb-0">
          Receipt No. GB${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
        </span>
      </div>
      <div class="float-start text-start d-none">
        <span class="d-block text-start text-danger text-size-small mb-0">
          NB: ${nBNotes}
        </span>
        <span class="d-block text-start text-size-strong mb-0">
          <span>Valuation for</span>: <span>${footNotes}</span>
        </span>
        <span class="d-block text-start text-size-h6 mb-0">
          <span class="text-size-header-small">${companyName} ${companyAddress}  TEL: ${contactPhone} ${contactEmail}</span>
        </span>
      </div>        
    </div> </div>`;
  }
  if (imagesHTML3 != '') {
    reportContent = reportContent + `<div class="mb-1 card a4-card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-auto">
          ${avatar}
        </div>
        <div class="col-6">
          <span class="text-size-header-small">${headNotes}</span><br>
          <span class="text-size-header-small">${companyName} ${companyAddress}<br> TEL: ${contactPhone} ${contactEmail}</span>
        </div>
        <div class="col">
          <div class="qr_code qrrcode"> </div>          
        </div>
      </div>
    </div>
    <div class="card-body loogbookFormCardBody" style="padding: 0; margin: 0;">
      <div class="row p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML3}</div>
    </div>
    <div class="card-footer text-body-secondary p-1">
      <div class="float-end text-end">
        <span class="d-block text-start text-size-small mb-0">
          Receipt No. GB${date.getFullYear()}/${date.getMonth()}/${date.getDay()}
        </span>
      </div>
      <div class="float-start text-start">
        <span class="d-block text-start text-danger text-size-small mb-0">
          NB: ${nBNotes}
        </span>
        <span class="d-block text-start text-size-strong mb-0">
          <span>Valuation for</span>: <span>${footNotes}</span>
        </span>
        <span class="d-block text-start text-size-h6 mb-0">
          <span class="text-size-header-small">${companyName} ${companyAddress}  TEL: ${contactPhone} ${contactEmail}</span>
        </span>
      </div>        
    </div> </div>`;
  }
  reportContent = reportContent + `</div>`;
  // Set reportContent to report element
  document.getElementById('report_Content').innerHTML = reportContent; */
  
  const avatar = `
    <div class="card" style="background-image: url('${headLogo}'); width: 250px; height: 100px; background-size: contain; background-position: center; background-repeat: no-repeat;"></div>
  `;
  const date = new Date();

  // Assume valuationType is provided (e.g., 'market', 'forced', 'insurance', 'custom')
  const valuationType = formData.get('valuationType') || 'market'; // Default to market
  
  var reportContent = `<div class="report_Card_Content">`;
  
  // Base A4 Card (Header and Common Details)
  reportContent += `
    <div class="card a4-card mb-1">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="col-auto">
            ${avatar}
          </div>
          <div class="col-6">
            <span class="text-size-header-small">${headNotes}</span><br>
            <span class="text-size-header-small">${companyName} ${companyAddress}<br>TEL: ${contactPhone} ${contactEmail}</span>
          </div>
          <div class="col">
            <div class="qr_code qrrcode"></div>          
          </div>
        </div>
      </div>
      <div class="card-body text-start p-3">
        <h1><b>${formData.get('make').toUpperCase()} ${formData.get('model').toUpperCase()} ${formData.get('modelType').toUpperCase()} ${formData.get('registrationNo').toUpperCase()} ${valuationType.toUpperCase()} VALUATION REPORT</b></h1>
        <div class="row justify-content-md-center mt-2">
          <div class="col">
            <strong class="text-size-strong">Ref. No.</strong> <span class="text-theme">${formData.get('corporateRefNo')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">SERIAL No</strong> <span class="text-theme">${formData.get('serialNo')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">ISSUED BY</strong> <span class="text-theme">${formData.get('valuer')}</span>
          </div>
        </div>
  `;
  
  // Valuation-Type-Specific Header Section
  //alert(valuationType);
  //if (valuationType === 'insurance') {
  if (valuationType === 'market') {
  
    reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">INSURER</strong> <span class="text-theme">${formData.get('insurer')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">EXPIRY DATE</strong> <span class="text-theme">${formData.get('expiryDate')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">POLICY NO.</strong> <span class="text-theme">${formData.get('policyNo')}</span>
          </div>
        </div>
    `;
  }
  
  reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">CLIENT NAME</strong> <span class="text-theme">${formData.get('clientName')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">CONTACTS</strong> <span class="text-theme">${formData.get('contactNumber')}</span>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <strong class="text-size-strong">KRA PIN</strong> <span class="text-theme">${formData.get('contactKRA')}</span>
              </div>
              <div class="col-7">
                <strong class="text-size-strong">Email</strong> <span class="text-theme">${formData.get('emaill')}</span>
              </div>          
            </div>
          </div>
        </div>
        <div class="float-start">
          <span class="text-size-strong">${bodyNotes}</span>
        </div><br> 
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">REGISTRATION NO</strong> <span class="text-theme">${formData.get('registrationNo')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">MAKE</strong> <span class="text-theme">${formData.get('make')}</span>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <strong class="text-size-strong">Model</strong> <span class="text-theme">${formData.get('model')}</span>
              </div>
              <div class="col-7">
                <strong class="text-size-strong">Model TYPE</strong> <span class="text-theme">${formData.get('modelType')}</span>
              </div>          
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">Body Type</strong> <span class="text-theme">${formData.get('bodyType')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">FUEL TYPE</strong> <span class="text-theme">${formData.get('fuelType')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">GEAR BOX</strong> <span class="text-theme">${formData.get('gearBox')}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">CHASSIS NO</strong> <span class="text-theme">${formData.get('chassisNo')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">ENGINE NO</strong> <span class="text-theme">${formData.get('engineNo')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">ENGINE RATING</strong> <span class="text-theme">${formData.get('engineRating')}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">YEAR OF MANF.</strong> <span class="text-theme">${formData.get('yearOfManf')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">DATE OF REG.</strong> <span class="text-theme">${formData.get('dateOfReg')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">ODOMETER-CURRENT READING</strong> <span class="text-theme">${addCommasToNumber(formData.get('odometerReading'))} ${formData.get('unitSelection')}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">Country of Origin</strong> <span class="text-theme">${formData.get('countryOfOrigin')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">COLOUR</strong> <span class="text-theme">${formData.get('colour')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">Tyres</strong> <span class="text-theme">${formData.get('tyres')}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">NO OF AIRBAGS</strong> <span class="text-theme">${formData.get('noOfAirbags')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">Anti Theft</strong> <span class="text-theme">${formData.get('antiTheft')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">TYPES OF LIGHTS</strong> <span class="text-theme">${formData.get('typesOfLights')}</span>
          </div>
        </div>
  `;
  
  // Valuation-Type-Specific Body Section
  reportContent += `
        <div class="row">
          <h6 class="text-size-strong">Coachwork Notes</h6>
          <p class="text-theme">${formData.get('coachworkNotes')}</p>
          <h6 class="text-size-strong">Extras</h6>
          <p class="text-theme">${formData.get('extras')}</p>
          <h6 class="text-size-strong">Electrical Notes</h6>
          <p class="text-theme">${formData.get('electricalNotes')}</p>
          <h6 class="text-size-strong">Mechanical Notes</h6>
          <p class="text-theme">${formData.get('mechanicalNotes')}</p><br>
          <strong class="text-size-strong">General Condition</strong> <span class="text-theme">${formData.get('generalCondition')}</span>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">Location of Inspection</strong> <span class="text-theme">${formData.get('locationOfInspection')}</span>
          </div>
          <div class="col">
            <strong class="text-size-strong">Destination</strong> <span class="text-theme">${formData.get('destination')}</span>
          </div>
        </div>
  `;
  
  // Valuation Results Section
  if (valuationType === 'market' || valuationType === 'insurance') {
    reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-Value">Market Value: </strong> 
            <span class="text-Value">${addCommasToNumber(formData.get('marketValue'))} /=</span> 
            <span class="text-danger">${convertNumberToWords(formData.get('marketValue'))}, Kenya Shillings Only</span>
          </div>
        </div>
    `;
  }
  
  if (valuationType === 'market' || valuationType === 'forced' || valuationType === 'custom') {
    reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-Value">Forced Value: </strong> 
            <span class="text-Value">${addCommasToNumber(formData.get('forcedValue'))} /=</span> 
            <span class="text-danger">${convertNumberToWords(formData.get('forcedValue'))}, Kenya Shillings Only</span>
          </div>
        </div>
    `;
  }
  
  if (valuationType === 'market' || valuationType === 'custom') {
    reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-Value">Radio Estimate: </strong> <span class="text-Value">${addCommasToNumber(formData.get('radioEstimate'))} /=</span>
          </div>
          <div class="col">
            <strong class="text-size-Value">Windscreen Estimate: </strong> <span class="text-Value">${addCommasToNumber(formData.get('windscreenEstimate'))} /=</span>
          </div>
        </div>
    `;
  }
  
  // Trends (Market Valuation Specific)
  if (valuationType === 'market') {
    // Assume trends come from valuation algorithm (e.g., stored in formData or fetched separately)
    const trends = JSON.parse(formData.get('trends') || '[]');
    if (trends.length > 0) {
      reportContent += `
        <div class="row mt-2">
          <h6 class="text-size-strong">Market Trends</h6>
          <ul class="text-theme">
      `;
      trends.forEach(trend => {
        reportContent += `<li>${trend}</li>`;
      });
      reportContent += `
          </ul>
        </div>
      `;
    }
  }
  
  // Remarks and NB
  reportContent += `
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">Remarks</strong> <span class="text-danger">${formData.get('remarks')}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong class="text-size-strong">NB</strong> <span class="text-danger">${formData.get('remedy')}</span>
          </div>
        </div>
  `;
  
  // Footer Section
  reportContent += `
        <div class="row mt-2">
          <div class="col">
            <strong class="text-size-strong">Valuation Date: </strong> <span class="text-theme">${formData.get('valuation_Date')}</span><br>
            <span class="signaturePng mt-1" style="background-image: url('${principalSign}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; display: block; width: 100%; height: 80px;"></span>
            <strong class="text-size-strong">Principal Valuer Sign</strong>
          </div>
          <div class="col">
            <strong class="text-size-strong">Examiner</strong> <span class="text-theme">${formData.get('examiner')}</span>
          </div>
          <div class="col-5">
            <strong class="text-size-strong">Instruction Date</strong> <span class="text-theme">${gettimeOfInspection()}</span>
            <span class="signaturePng mt-1" style="background-image: url('${directorSign}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; display: block; width: 50%; height: 80px;"></span>
            <strong class="text-size-strong">Director Sign</strong>
          </div>
        </div>
      </div>
      <div class="card-footer text-body-secondary p-1">
        <div class="float-end text-end">
          <span class="d-block text-start text-size-small mb-0">
            Receipt No. GB${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
          </span>
        </div>
        <div class="float-start text-start">
          <span class="d-block text-start text-danger text-size-small mb-0">
            NB: ${nBNotes}
          </span>
          <span class="d-block text-start text-size-strong mb-0">
            <span>Valuation for</span>: <span>${footNotes}</span>
          </span>
          <span class="d-block text-start text-size-h6 mb-0">
            <span class="text-size-header-small">${companyName} ${companyAddress} TEL: ${contactPhone} ${contactEmail}</span>
          </span>
        </div>        
      </div>
    </div>
  `;
  
  // Image Pages (Common Across All Types)
  reportContent += `
    <div class="mb-1 card a4-card">
      <div class="card-header">
        <div class="row align-items-center">
          <div class="col-auto">
            ${avatar}
          </div>
          <div class="col-6">
            <span class="text-size-header-small">${headNotes}</span><br>
            <span class="text-size-header-small">${companyName} ${companyAddress}<br>TEL: ${contactPhone} ${contactEmail}</span>
          </div>
          <div class="col">
            <div class="qr_code qrrcode"></div>          
          </div>
        </div>
      </div>
      <div class="card-body cardBody" style="padding: 0; margin: 0;">
        <div class="row imagesRow p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML}</div>
      </div>
      <div class="card-footer text-body-secondary p-1">
        <div class="float-end text-end">
          <span class="d-block text-start text-size-small mb-0">
            Receipt No. GB${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
          </span>
        </div>
      </div>
    </div>
  `;
  
  if (imagesHTML2 !== '') {
    reportContent += `
      <div class="mb-1 card a4-card">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-auto">
              ${avatar}
            </div>
            <div class="col-6">
              <span class="text-size-header-small">${headNotes}</span><br>
              <span class="text-size-header-small">${companyName} ${companyAddress}<br>TEL: ${contactPhone} ${contactEmail}</span>
            </div>
            <div class="col">
              <div class="qr_code qrrcode"></div>          
            </div>
          </div>
        </div>
        <div class="card-body cardBody" style="padding: 0; margin: 0;">
          <div class="row imagesRow p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML2}</div>
        </div>
        <div class="card-footer text-body-secondary p-1">
          <div class="float-end text-end">
            <span class="d-block text-start text-size-small mb-0">
              Receipt No. GB${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
            </span>
          </div>
        </div>
      </div>
    `;
  }
  
  if (imagesHTML3 !== '') {
    reportContent += `
      <div class="mb-1 card a4-card">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-auto">
              ${avatar}
            </div>
            <div class="col-6">
              <span class="text-size-header-small">${headNotes}</span><br>
              <span class="text-size-header-small">${companyName} ${companyAddress}<br>TEL: ${contactPhone} ${contactEmail}</span>
            </div>
            <div class="col">
              <div class="qr_code qrrcode"></div>          
            </div>
          </div>
        </div>
        <div class="card-body loogbookFormCardBody" style="padding: 0; margin: 0;">
          <div class="row p-0 m-0 g-2" style="margin: 0; padding: 0;">${imagesHTML3}</div>
        </div>
        <div class="card-footer text-body-secondary p-1">
          <div class="float-end text-end">
            <span class="d-block text-start text-size-small mb-0">
              Receipt No. GB${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
            </span>
          </div>
          <div class="float-start text-start">
            <span class="d-block text-start text-danger text-size-small mb-0">
              NB: ${nBNotes}
            </span>
            <span class="d-block text-start text-size-strong mb-0">
              <span>Valuation for</span>: <span>${footNotes}</span>
            </span>
            <span class="d-block text-start text-size-h6 mb-0">
              <span class="text-size-header-small">${companyName} ${companyAddress} TEL: ${contactPhone} ${contactEmail}</span>
            </span>
          </div>        
        </div>
      </div>
    `;
  }
  
  reportContent += `</div>`;
  
  // Set reportContent to report element
  document.getElementById('report_Content').innerHTML = reportContent;
  
  //updateWatermarkImage(headLogo);
  changeBackgroundColor(localStorage.getItem('themeColor'));

  document.querySelector("#report_Content").style.display = "block";
  document.querySelector("#view_Report_Content").style.display = "none";


  const cardBody = document.querySelector('.cardBody');
  const cardBodyStyles = window.getComputedStyle(cardBody);

  // Assuming you want to style all elements with class 'valuationFormCard'
  var valuationFormCardStyles_paddingRight = 3;
  var valuationFormCardStyles_paddingTop = 3;  
  // Extract padding and margin values
  const paddingTop = parseFloat(cardBodyStyles.paddingTop);
  const paddingBottom = parseFloat(cardBodyStyles.paddingBottom);
  const paddingLeft = parseFloat(cardBodyStyles.paddingLeft);
  const paddingRight = parseFloat(cardBodyStyles.paddingRight);
  const marginTop = parseFloat(cardBodyStyles.marginTop);
  const marginBottom = parseFloat(cardBodyStyles.marginBottom);
  const marginLeft = parseFloat(cardBodyStyles.marginLeft);
  const marginRight = parseFloat(cardBodyStyles.marginRight);

  // Calculate available width and height excluding padding and margin
  const cardBodyWidth = cardBody.clientWidth - paddingLeft - paddingRight - marginLeft - marginRight;
  const cardBodyHeight = cardBody.clientHeight - paddingTop - paddingBottom - marginTop - marginBottom;

  // Calculate dimensions for each card (2 columns, 4 rows)
  const cardWidth = cardBodyWidth / 2;
  const cardHeight = cardBodyHeight / 4;
  $('.valuationFormCard').each(function() {
    // Adjust the width and height of the card
    this.style.width = `${cardWidth - valuationFormCardStyles_paddingRight}px`;
    this.style.height = `${cardHeight - valuationFormCardStyles_paddingTop}px`;
    
    // Set background-size based on the camera_toggle value
    if (camera_toggle === 0) {
        this.style.backgroundSize = 'cover';
    } else {
        //this.style.backgroundSize = 'contain';
        this.style.backgroundSize = 'cover';

    }
  });  

  const savedColor = localStorage.getItem('themePdfColor') || '#171716'; 
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const savedFontSize = localStorage.getItem('themePdfFontSize') || '0.7';

  if (savedColor) {
      document.querySelectorAll('.text-theme').forEach(el => {
          el.style.color = savedColor;
          //alert(savedFontSize);
          el.style.fontSize = savedFontSize + 'em';

      });
      document.getElementById('colorPdfPicker').value = savedColor; // Update the color picker UI

      fontSizeSlider.value = savedFontSize;
      fontSizeValue.textContent = savedFontSize;
  }


  const loogbookFormCardBody = document.querySelector('.loogbookFormCardBody');
  $('.loogbookFormCard').each(function() {
    this.style.width = `${loogbookFormCardBody.clientWidth-valuationFormCardStyles_paddingRight}px`;
    this.style.height = `${loogbookFormCardBody.clientHeight-valuationFormCardStyles_paddingTop}px`;
  });

  const cardBodies = document.querySelectorAll('.a4-card .card-body');

  cardBodies.forEach(cardBody => {
    const newImagePath = headLogo; // Dynamically set the path to the image
    cardBody.style.setProperty('--background-image', `url('${newImagePath}')`);
    cardBody.style.setProperty('--background-size', `contain`);
  });  

  // Show/hide relevant elements as needed
  document.getElementById('valuationForm').style.display = "none";
  document.getElementById('report').style.display = "block";
  // Add event listeners for buttons

  /**if ($(".newReportModalFooter").length) {
    $(".newReportModalFooter").html(`<button type="button" class="btn btn-bd-primary submit-report-btn">Submit Report</button>`);
  }

  // Use event delegation (better for dynamically added elements)
  $(document).on("click", ".submit-report-btn", function() {
    $('#generateReport').html('Generate Report');
    $("#upload_valuationReport_help").html('');
      submitReport();
  }); */

  submitReport();

}
function submitReport() {
  document.getElementById('submitReport').disabled = true;
  document.getElementById('newReport').disabled = true;
  document.getElementById('downloadReport').disabled = true;
  document.getElementById('viewReport').classList.add('d-none');
  document.getElementById('submitReport').classList.remove('d-none');

  const form = document.getElementById('valuationForm');
  const fileInputs = form.querySelectorAll('input[type="file"]');
  const formData = new FormData();
  // Append all non-file form data to the new FormData object
  const formElements = form.elements;
  for (const element of formElements) {
    if (element.type !== 'file') {
      formData.append(element.name, element.value);
    }
  }
  // Function to convert image URL to base64 data URI
  const urlToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    });
  };
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          // Convert the canvas content to a Blob
          canvas.toBlob((blob) => { 
            // Resolve the promise with a new File object created from the Blob
            resolve(new File(
                [blob],            // Blob data to create the file
                file.name,         // Name of the new file
                {
                    type: 'image/jpeg',       // MIME type of the file
                    lastModified: Date.now()  // Timestamp of when the file was last modified
                }
            ));
          }, 'image/jpeg', Number(image_quality/100)); // Specify the MIME type and quality of the image
        
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'pt', 'a4');
  const a4_cards = document.querySelectorAll('.a4-card');
  $('.qrrcode').empty();
  var file_name = `${formData.get('make')}_${formData.get('model')}_${formData.get('modelType')}_${formData.get('registrationNo')}_${Date.now()}_VALUATION_REPORT`;
  file_name = file_name.replace(/\s+/g, '_').toLowerCase();
  file_name += ".pdf";

  var selectedCompanyID = localStorage.getItem('userCompanyID');                  
  // Find the selected company in the companies array
  var selectedCompany = companies.find(function(company) {
      return company.CompanyID == selectedCompanyID;
  });
  var CompanyName = "";
  // If a matching company is found, set the input values
  if (selectedCompany) {
      CompanyName = selectedCompany.CompanyName;
  }
  let targetDir = CompanyName.replace(/\s+/g, '_');  // Replace spaces with underscores
  targetDir = 'arybit_' + targetDir.toLowerCase();  // Prepend 'arybit_' and convert to lowercase
  
  var valuationReportUrl = "" + storage_server + "" + targetDir + "/" + file_name;
  valuationReportUrl = valuationReportUrl.replace('handle_request', 'media');
  valuationReportUrl = valuationReportUrl.trim();  
  $('.qrrcode').each(function() {
    new QRCode(this, { 
      text: valuationReportUrl,
      width: 100,
      height: 100
    });
  });

  async function captureCard(index) {

    if (index >= a4_cards.length) {  

      const pdfBlob = pdf.output('blob');
      formData.append('valuationReport[]', pdfBlob, file_name);
      formData.append('deviceID', localStorage.getItem('deviceID'));
      formData.append('userEmail', localStorage.getItem('userEmail'));
      formData.append('userPasswordHash', localStorage.getItem('userPasswordHash'));
      formData.append('maessa_up_Arr', maessa_up_Arr);
      formData.append('action', action);
      //alert(action);      
      $('#submitReport').html('Uploading Report...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
      $('#generateReport').html('Generate Report');      
      const handleFiles = async () => {
        for (const input of fileInputs) {
          if (input.files.length > 0) {
            const file = input.files[0];
            //const compressedFile = await compressImage(file);
            //formData.append(input.name, compressedFile);
          }
        }
        addNetworkEventListener_count = 1;
        document.getElementById('pdfRetryUpload').classList.add('d-none');
        document.getElementById('submitReport').classList.remove('d-none');

        $.ajax({
          url: server_Url +  'valuationReport.php',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
              if (evt.lengthComputable) {
                var percentage = Math.floor((evt.loaded / evt.total) * 100);
                var progressbar = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
                  '<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ' + percentage + '%;">' + percentage + '%</div>' +
                  '</div>';
                $("#upload_valuationReport_help").html(progressbar);
              }
            }, false);
            return xhr;
          },
          success: function(response) { 
            //alert(response.insepectID);           
            showSnackbar(response.messageError);
            document.querySelector("#report_Content").style.display = "none";
            document.querySelector("#view_Report_Content").style.display = "block";
            $('.view_inspection_report_err').html('');
            displayPdf(response.reportFileURL,document.getElementById('view_Report_Content'));            
            localStorage.setItem('valuationReportUrl', response.reportFileURL);
            $('#viewReport').html('Download Report');
            $('#viewReport').attr('href', response.reportFileURL);
            
            if (response.status) {      
              $("#upload_valuationReport_help").html('<span class="text-success">' + response.messageError + '</span>');
              localStorage.removeItem("valuationFormData");

              Promise.all(uploadedFiles.map(file => 
                resizeImage(file.imageData).then(resizedImageData => {
                  file.imageData = resizedImageData;
                }).catch(error => {
                  showSnackbar(`Error resizing image: ${error.message}`);
                  // Optionally handle errors per file
                })
              )).then(() => {
                showSnackbar('All images resized successfully');
              }).catch(() => {
                showSnackbar('Some images failed to resize');
              });

              // Step 1: Collect data from hidden inputs
              const hiddenInputs = document.querySelectorAll('input[name="fileDataUrls[]"]');
              const fileDataUrls = [];
              hiddenInputs.forEach(hiddenInput => {
                fileDataUrls.push(hiddenInput.value);
              });
              
              // Step 2: Combine uploadedFiles, metadata, and fileDataUrls into a single JSON object
              const metadata = {
                fileDataUrls: fileDataUrls,
                uploadedFiles: uploadedFiles.map(fileObj => ({
                  imageData: fileObj.imageData, // Base64 image data
                  fileName: fileObj.maessa_up   // File name
                }))
              };
              
              // Step 3: Convert the JSON object to a string
              const jsonString = JSON.stringify(metadata);
              
              // Step 4: Create a Blob from the JSON string
              const jsonBlob = new Blob([jsonString], { type: 'application/json' });
              
              // Step 5: Create a unique file name based on make, model, modelType, and registrationNo
              const fileName = `${response.Make}_${response.Model}_${response.ModelType}_${response.RegistrationNo}.json`.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
              
              // Step 6: Create a FormData object and attach the JSON file (as Blob)
              const metadataFormData = new FormData();
  
              // Step 7: Append the file with a key name 'metadata'
              metadataFormData.append('metadata[]', jsonBlob, fileName);
              metadataFormData.append('ReportID', response.message.ReportID); // Append the corresponding ReportID      
              metadataFormData.append('VehicleID', response.message.VehicleID); // Append the corresponding VehicleID
              //alert('Make ' + response.Make + ' Model ' + response.Model);
              metadataFormData.append('make', response.Make); // Append the corresponding make     
              metadataFormData.append('model', response.Model); // Append the corresponding model 
              metadataFormData.append('modelType', response.ModelType); // Append the corresponding modelType     
              metadataFormData.append('registrationNo', response.RegistrationNo); // Append the corresponding registrationNo
              metadataFormData.append('action', action); // Append the corresponding action

              // Step 8: Upload the metadata using AJAX
              if (uploadedFiles.length == 0) {

                if (uploadedVideoFiles.length == 0) {
                  $('#submitReport').html('Submit Report'); 
                  action = "submitReport";                  
                  document.getElementById('submitReport').disabled = false;
                  document.getElementById('newReport').disabled = false;
                  document.getElementById('downloadReport').disabled = false;
                  document.getElementById('submitReport').classList.add('d-none');
                  document.getElementById('viewReport').classList.remove('d-none');
                  addNetworkEventListener_count = 0;
                  addNetworkEventGenerateReportListener_count = 0;
                  refresh_dashboard = true; 
                  onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", "");
  
                  const newReportModal = document.getElementById("newReportModal");
                  const modalInstance = bootstrap.Modal.getInstance(newReportModal);
                  if (modalInstance) {
                    modalInstance.hide();
                  }
                
                  // Remove modal backdrop and reset body state
                  document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
                  document.body.classList.remove("modal-open");
                  document.body.style.overflow = "";
  
                  document.querySelectorAll(".resumeReport").forEach(element => {
                    element.classList.add("d-none");
                  });
                  setupNewReport();
                  
                } else {
                  const metadataVideoData = new FormData();
                  let fileVideoName;

                  uploadedVideoFiles.forEach((file, index) => {
                      // Step 1: Create a unique file name based on make, model, modelType, and registrationNo
                      const maessa_up = file.maessa_up || "default";  // Fallback if maessa_up is missing

                      const fileVideoName = `${response.Make}_${response.Model}_${response.ModelType}_${response.RegistrationNo}_${maessa_up.replace(/\s+/g, '_')}.mp4`.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
                  
                      // Step 2: Attach the video file as Blob to FormData
                      metadataVideoData.append(`videoData_${index}`, file.blobEntry, fileVideoName);
                  });
                  
                  // Step 3: Append metadata fields
                  metadataVideoData.append('ReportID', response.message.ReportID);
                  metadataVideoData.append('VehicleID', response.message.VehicleID);
                  metadataVideoData.append('make', response.Make);
                  metadataVideoData.append('model', response.Model);
                  metadataVideoData.append('modelType', response.ModelType);
                  metadataVideoData.append('registrationNo', response.RegistrationNo);
                  metadataVideoData.append('action', action);

                  document.getElementById('submitReport').classList.remove('d-none');
                  $("#upload_valuationReport_help").html('<span class="text-success">Uploading ' + fileVideoName + '</span>');
                  $('#submitReport').html('Uploading ' + uploadedVideoFiles.length + ' Videos...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');

                  // Step 4: Upload the FormData
                  uploadVideo(metadataVideoData);


                  document.getElementById('chuckRetryVideoUpload').addEventListener('click', function() {
                    $('#submitReport').html('Uploading ' + uploadedVideoFiles.length + ' Videos...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
                    uploadVideo(metadataVideoData);
                  });

                }
              } else {
                document.getElementById('submitReport').classList.remove('d-none');
                $('#submitReport').html('Uploading ' + uploadedFiles.length + ' Images...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
                
                //alert('ReportID ' + metadataFormData.get('ReportID') + ' VehicleID ' + metadataFormData.get('VehicleID') + ' metadata ' + metadataFormData.get('metadata[]'));

                uploadChunkedMetadata(metadataFormData);

                document.getElementById('chuckRetryUpload').addEventListener('click', function() {
                  document.getElementById('submitReport').classList.remove('d-none');
                  $('#submitReport').html('Uploading ' + uploadedFiles.length + ' Images...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
                  uploadChunkedMetadata(metadataFormData);                  
                });
              }              
            } else {
              $("#upload_valuationReport_help").html('<span class="text-danger">' + response.messageError + '</span>');
              document.getElementById('submitReport').disabled = false;
              //document.getElementById('pdfRetryUpload').classList.remove('d-none');
              //document.getElementById('submitReport').classList.add('d-none');
              document.getElementById('valuationForm').style.display = "block";
              document.getElementById('report').style.display = "none";
              $('#submitReport').html('Submit Report');
              $("#upload_valuationReport_help").html('');
            }
          },
          error: function(xhr, status, error) {
            addNetworkEventListener_count = 0;
            showSnackbar('An error occurred while submitting the report.' + JSON.stringify(xhr));
            document.getElementById('submitReport').disabled = false;
            document.getElementById('newReport').disabled = false;
            document.getElementById('downloadReport').disabled = false;
            document.getElementById('valuationForm').style.display = "block";
            document.getElementById('report').style.display = "none";
            //document.getElementById('pdfRetryUpload').classList.remove('d-none');
            //document.getElementById('submitReport').classList.add('d-none');
            //document.getElementById('newReport').classList.add('d-none');
            //document.getElementById('downloadReport').classList.add('d-none');
            $('#submitReport').html('Submit Report');
            $("#upload_valuationReport_help").html('');
          }
        });
      };
      handleFiles();
      const retryButton = document.getElementById('pdfRetryUpload');

      // Define the function separately so you can reference it when removing the listener
      function handleFilesClick() {
        handleFiles();
      }
      
      // First, remove any existing event listener to avoid duplicates
      retryButton.removeEventListener('click', handleFilesClick);
      
      // Then, add the event listener again
      retryButton.addEventListener('click', handleFilesClick);
      
      return;
    } else {
      const card = a4_cards[index];
      // Replace background-image URLs with base64 data URIs
      const bgImage = card.style.backgroundImage;
      const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);

      if (urlMatch) {
        const imageUrl = urlMatch[1];
        try {
          const base64Image = await urlToBase64(imageUrl);
          card.style.backgroundImage = `url(${base64Image})`;
        } catch (error) {
          showSnackbar('Failed to convert image URL to base64:' + error);
        }
      }
      const images = card.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        html2canvas(card, { scale: 5, useCORS: true, allowTaint: false }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', Number(image_quality/100));
          //const imgData = canvas.toDataURL('image/png');  // Use PNG for lossless compression
          const pageHeight = 842;
          const pageWidth = 595;
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = pageWidth / imgWidth;
          const adjustedImgHeight = imgHeight * ratio;
          const totalPages = Math.ceil(adjustedImgHeight / pageHeight);
          for (let i = 0; i < totalPages; i++) {
            const position = -i * pageHeight;
            pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, adjustedImgHeight, undefined, 'FAST');
            //pdf.addImage(imgData, 'PNG', 0, position, pageWidth, adjustedImgHeight, undefined, 'FAST');

            if (i < totalPages - 1) {
              pdf.addPage();
            }
          }
          if (index < a4_cards.length - 1) {
            pdf.addPage();
          }
          $('#submitReport').html('Generating report page ' + Number(index + 1) + ' ... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');

          captureCard(index + 1);
        }).catch(error => {
          showSnackbar('An error occurred while generating the report .' + error);
          document.getElementById('submitReport').disabled = false;
          document.getElementById('newReport').disabled = false;
          $('#submitReport').html('Submit Report');
        });
      }).catch(error => {
        showSnackbar('An error occurred while loading images.' + error);
      });
    }
  }
  $('#submitReport').html('Loading images...<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
  captureCard(0);
} 
// Function to retrieve imageHTML by label
function getImageHTML(label,imageArray) {
    for (let i = 0; i < imageArray.length; i++) {
        if (imageArray[i][label]) {
            return imageArray[i][label];
        }
    }
    return null; // Return null if the label is not found
}
function addHiddenFields(data_url,label) {
  const form = document.getElementById('valuationForm');
  const fileInputs = form.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    const dataUrl = input.getAttribute('data-url');
    if (dataUrl == data_url) {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'fileDataUrls[]';
      hiddenInput.value = dataUrl;
      form.appendChild(hiddenInput);
    }
  });
}
function setupNewReport() {
  imgAddcount = 0;
  uploadedFiles = [];
  uploadedTimeFiles = [];

  uploadedVideoFiles = [];
  uploadedTimeVideoFiles = [];

  action = "submitReport";
  imgAddcount = 0;
  imgAdd_count = 0;
  imgDetect_count = 0;
  if (role == "Valuer") {
    //document.querySelector(".camera-toggle").classList.add("d-none");
  }

  localStorage.setItem('FormID',0);

  $('#vehiclePhotos').html(`
      <div class="col mt-2 add-img-imgAdd add-img-bt-center-container">
          <span type="button" class="btn btn-bd-primary mt-2 mb-2 imgAdd">
              <i class="fa-solid fa-plus"></i>
          </span>
      </div>
  `);

  document.querySelector("#valuationForm").style.display = "block";
  document.querySelector("#report").style.display = "none";
  document.getElementById('valuationForm').reset();
  document.querySelector(".ApproverForms").classList.add("d-none");
  document.querySelector(".valuation_Form").classList.remove("d-none");

  var serialNo = generateSerialNo();
  localStorage.setItem('serialNo', serialNo);
  document.getElementById('corporateRefNo').value = localStorage.getItem('corporateRefNo');
  document.getElementById('serialNo').value = serialNo;

  var dateObj = new Date(timestamp);
  var formattedDate = dateObj.toISOString().split('T')[0];
  var formattedTime = dateObj.toTimeString().split(' ')[0].substring(0, 5);

  document.getElementById('valuation_Date').value = formattedDate;
  document.getElementById('dateOfInspection').value = formattedDate;
  document.getElementById('inspectionTime').value = formattedTime;

  $("#valuer").val(localStorage.getItem('userCompanyName'));
  $("#examiner").val(localStorage.getItem('userUsername'));

}

function uploadChunkedMetadata(metadataFormData) {
  addNetworkEventListener_count = 1;
  document.getElementById('chuckRetryUpload').classList.add('d-none');

  $.ajax({
    url: server_Url + 'metadataFormData.php',
    type: 'POST',
    data: metadataFormData,
    processData: false,
    contentType: false,
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (evt) {
        if (evt.lengthComputable) {
          var percentage = Math.floor((evt.loaded / evt.total) * 100);
          var progressbar = `
            <div class="progress" role="progressbar" aria-label="Uploading..." aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${percentage}%;">${percentage}%</div>
            </div>`;
          $("#upload_valuationReport_help").html(progressbar);
        }
      }, false);
      return xhr;
    },
    success: function (response) {
      try {
        if (typeof response === "string") {
          response = JSON.parse(response);
        }

        if (response.status) {
          $("#upload_valuationReport_help").html(response.message);

          if (uploadedVideoFiles.length === 0) {
            $('#submitReport').html('Submit Report');
            action = "submitReport";
            document.getElementById('submitReport').disabled = false;
            document.getElementById('newReport').disabled = false;
            document.getElementById('downloadReport').disabled = false;
            document.getElementById('submitReport').classList.add('d-none');
            document.getElementById('viewReport').classList.remove('d-none');
            addNetworkEventListener_count = 0;
            addNetworkEventGenerateReportListener_count = 0;
            refresh_dashboard = true;

            onlineGimbo(localStorage.getItem('userUsername'), localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", "");

            const newReportModal = document.getElementById("newReportModal");
            const modalInstance = bootstrap.Modal.getInstance(newReportModal);
            if (modalInstance) {
              modalInstance.hide();
            }

            // Remove modal backdrop and reset body state
            document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";

            document.querySelectorAll(".resumeReport").forEach(element => {
              element.classList.add("d-none");
            });

            setupNewReport();

          } else {
            const metadataVideoData = new FormData();

            uploadedVideoFiles.forEach((file, index) => {
              // Step 1: Generate a unique filename
              const maessa_up = file.maessa_up || "default";  // Fallback if maessa_up is missing

              const fileVideoName = `${metadataFormData.get('make')}_${metadataFormData.get('model')}_${metadataFormData.get('modelType')}_${metadataFormData.get('registrationNo')}_${maessa_up.replace(/\s+/g, '_')}.mp4`.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
              
              // Step 2: Attach video file to FormData
              metadataVideoData.append(`videoData_${index}`, file.blobEntry, fileVideoName);
            });

            // Step 3: Append metadata
            metadataVideoData.append('ReportID', metadataFormData.get('ReportID'));
            metadataVideoData.append('VehicleID', metadataFormData.get('VehicleID'));
            metadataVideoData.append('make', metadataFormData.get('make'));
            metadataVideoData.append('model', metadataFormData.get('model'));
            metadataVideoData.append('modelType', metadataFormData.get('modelType'));
            metadataVideoData.append('registrationNo', metadataFormData.get('registrationNo'));
            metadataVideoData.append('action', metadataFormData.get('action'));

            document.getElementById('submitReport').classList.remove('d-none');
            $("#upload_valuationReport_help").html(`<span class="text-success">Uploading ${uploadedVideoFiles.length} videos...</span>`);
            $('#submitReport').html(`Uploading ${uploadedVideoFiles.length} Videos...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`);

            // Step 4: Upload the FormData
            uploadVideo(metadataVideoData);


            document.getElementById('chuckRetryVideoUpload').addEventListener('click', function() {
              $('#submitReport').html('Uploading ' + uploadedVideoFiles.length + ' Videos...<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');
              uploadVideo(metadataVideoData);
            });
          }
        } else {
          $("#upload_valuationReport_help").html(response.messageError);
          document.getElementById('chuckRetryUpload').classList.remove('d-none');
          document.getElementById('submitReport').classList.add('d-none');
          $('#submitReport').html('Submit Report');
        }
      } catch (error) {
        //console.error("Error processing response:", error);
        $("#upload_valuationReport_help").html("An unexpected error occurred.");
        document.getElementById('chuckRetryUpload').classList.remove('d-none');
        document.getElementById('submitReport').classList.add('d-none');
        $('#submitReport').html('Submit Report');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      //console.error("Upload failed:", textStatus, errorThrown);
      $("#upload_valuationReport_help").html(JSON.stringify(jqXHR));
      document.getElementById('chuckRetryUpload').classList.remove('d-none');
      document.getElementById('submitReport').classList.add('d-none');
      $('#submitReport').html('Submit Report');
    }
  });
}

function uploadVideo(formData) {
    document.getElementById('chuckRetryVideoUpload').classList.add('d-none');
    document.getElementById('submitReport').classList.remove('d-none');
    $.ajax({
      url: server_Url +  'uploadVideo.php',
      type: "POST",
        data: formData,
        processData: false, // Prevent jQuery from automatically processing data
        contentType: false, // Prevent jQuery from setting content type
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var percentage = Math.floor((evt.loaded / evt.total) * 100);
              var progressbar = '<div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="' + percentage + '" aria-valuemin="0" aria-valuemax="100">' +
                '<div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ' + percentage + '%;">' + percentage + '%</div>' +
                '</div>';
              $("#upload_valuationReport_help").html(progressbar);
            }
          }, false);
          return xhr;
        },
        success: function (response) {
          //alert(response.message);
          if (response.status) {
            $("#upload_valuationReport_help").html('<span class="text-danger">' + response.message + '</span>');

            $('#submitReport').html('Submit Report'); 
            action = "submitReport";                  
            document.getElementById('submitReport').disabled = false;
            document.getElementById('newReport').disabled = false;
            document.getElementById('downloadReport').disabled = false;
            document.getElementById('submitReport').classList.add('d-none');
            document.getElementById('viewReport').classList.remove('d-none');
            addNetworkEventListener_count = 0;
            addNetworkEventGenerateReportListener_count = 0;
            refresh_dashboard = true; 
            onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", "");
            
            const newReportModal = document.getElementById("newReportModal");
            const modalInstance = bootstrap.Modal.getInstance(newReportModal);
            if (modalInstance) {
              modalInstance.hide();
            }
          
            // Remove modal backdrop and reset body state
            document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
          
            document.querySelectorAll(".resumeReport").forEach(element => {
              element.classList.add("d-none");
            });
            setupNewReport();

            // Step 1: Delete videos from device (clear the uploadedVideoFiles array)
            uploadedVideoFiles.forEach(file => {
                if (file.blobEntry instanceof Blob) {
                    URL.revokeObjectURL(file.blobEntry); // Revoke object URL
                }
            });
            
                        
          } else {
            document.getElementById('chuckRetryVideoUpload').classList.remove('d-none');
            document.getElementById('submitReport').classList.add('d-none');
            $("#upload_valuationReport_help").html('<span class="text-danger">' +  response.messageError + '</span>');
          }
        },
        error: function (xhr, status, error) {
            document.getElementById('chuckRetryVideoUpload').classList.remove('d-none');
            document.getElementById('submitReport').classList.add('d-none');
            $("#upload_valuationReport_help").html('<span class="text-danger">' + JSON.stringify(xhr) + '</span>');
            //alert(JSON.stringify(xhr));
        }
    });
}

function onlineGimbo(userUsername,_email,password,action,id) {
  if (action == "dashboard" && id != 4) {
    document.querySelector(".main-spinner-container").classList.remove("d-none");
  }
  addNetworkEventListener_count = 1;
  getDashboard(userUsername,_email,password,action,id);
  
}
function updateDashboard(maxRetries = 4, currentRetry = 0) {
  setTimeout(() => {
    if (addNetworkEventListener_count === 0 && addNetworkEventGenerateReportListener_count === 0) {

      if (window.location.hostname == "localhost") {

        if (cordova.platformId == "android") {
            FirebasePlugin.onMessageReceived(function(notification) {            
                // Handle notification here
                //alert(JSON.stringify(notification)); 
        
            }, function(error) {
                //alert("Error receiving notification: " + error);
            });
                     
            FirebasePlugin.onTokenRefresh(function(fcmToken) {
                localStorage.setItem('fcmToken',fcmToken);
            }, function(error) {

            });                                
        }
        
      }

      onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", maxRetries);
    }
    // Retry until maxRetries is reached
    if (currentRetry === maxRetries) {
      addNetworkEventListener_count = 0;
      addNetworkEventGenerateReportListener_count = 0;
      currentRetry = 0;
      refresh_dashboard = true; 

    }
    updateDashboard(maxRetries, currentRetry + 1);
  }, 5000);
}
function getDashboard(userUsername,_email,password,action,id) {
  //alert(action + ' ' + id);

  var local_refresh_dashboard = refresh_dashboard;
  //alert(action + ' ' + refresh_dashboard);

  $.ajax({
    url: server_Url +  'dashboard.php',
    method: 'POST', // You can change the HTTP method to GET if needed
    data: {
      deviceID: localStorage.getItem('deviceID'),
      fcmToken: localStorage.getItem('fcmToken'),
      offset: localStorage.getItem('offset'),
      limit: localStorage.getItem('limit'),
      userUsername: userUsername,
      email: _email,
      password_hash: password,
      id:id,
      action: action
    },
    dataType: 'json', // Change the dataType to the expected response type
    success: function(response) {
      var response_offset = Number(Number(localStorage.getItem('offset')) + Number(response.reports.length));     
      
      if (action == 'featuredAuctions') {
        showSnackbar(response.message.messageError);
      }

      if (response.limit > response.reports.length) {
        localStorage.setItem('offset', 0);

        if (response_valuationForms && response_valuationForms.length !== undefined) {
  
          if (companies.length < response.companies.length || 
            companyDetails.length < response.companyDetails.length ||  // Ensure companyDetails is an array
            response_valuationForms.length < responseValuationForms.length || 
            response_valuationTypes.length < response.valuationTypes.length || 
            response_industryTypes.length < response.industryTypes.length || 
            response_valuerUsers.length < response.valuerUsers.length || 
            response_companyUsers.length < response.companyUsers.length || 
            response_requests.length < response.requests.length || 
            response_requestsVehicles.length < response.requestsVehicles.length || 
            response_requestsReports.length < response.requestsReports.length || 
            response_assignments.length < response.assignments.length || 
            response_recentActivity.length < response.recentActivity.length || 
            response_reports.length < responseReports.length || 
            response_images.length < response.images.length || 
            response_vehicles.length < response.vehicles.length) {
              refresh_dashboard = true;
          }
        } else {
          refresh_dashboard = true;
        }

        if (response_offset < response.limit) {          
          responseReports = response.reports;
          responseValuationForms = response.valuationForms; 
          responseImages = response.images;
          responseVehicles = response.vehicles;
          
        } else {
                
          responseReports.push(...response.reports);  // Using spread syntax to add new reports
          responseValuationForms.push(...response.valuationForms);  // Using spread syntax to add new valuationForms
          responseImages.push(...response.images);  // Using spread syntax to add new images
          responseVehicles.push(...response.vehicles);  // Using spread syntax to add new vehicles
        }

      } else {

        localStorage.setItem('offset', response_offset);

        if (response.reports.length == response_offset) {

          responseReports = response.reports;
          responseValuationForms = response.valuationForms;
          responseImages = response.images;
          responseVehicles = response.vehicles;
        
        } else if (response_offset <= 50){

          responseReports.push(...response.reports);  // Using spread syntax to add new reports
          responseValuationForms.push(...response.valuationForms);  // Using spread syntax to add new valuationForms 
          responseImages.push(...response.images);  // Using spread syntax to add new images
          responseVehicles.push(...response.vehicles);  // Using spread syntax to add new vehicles

        }

        onlineGimbo(localStorage.getItem('userUsername'),localStorage.getItem('userEmail'), localStorage.getItem('userPasswordHash'), "dashboard", 4);

      }

      if (response.limit > response.reports.length) {
        
        let notification_count = 0;
        $('.notifications-list').html(`
            <ul class="nav justify-content-center mt-3 mb-3 sticky-top">
                <span class="btn btn-outline-light me-2 response-notifications" data-action="mark">
                   Mark all as read
                </span>
                <span class="btn btn-outline-light response-notifications" data-action="delete">
                   Delete all
                </span>
            </ul>
        `); // Clear notification list
        
        response.notifications.forEach(notification => {
            if (notification.IsRead != 1) {
                notification_count++;
            }
        
            const notificationItem = `
                <li class="notifications-list-group-item bg-dark p-2 text-light mb-2">
                    <div class="d-flex justify-content-between">
                        <h6 class="mb-1">${notification.Title}</h6>
                        <small class="text-primary">${convert_date_to_words(notification.CreatedAt)}</small>
                    </div>
                    <p class="mb-1">${notification.Message}</p>
                </li>
            `;
            $('.notifications-list').append(notificationItem);
        });
        
        // Update notification count
        if (notification_count > 0) {
            $('.notification-count').text(notification_count).show();
        } else {
          if (response.notifications.length == 0) {
            $('.notifications-list').html('<li class="text-muted text-center">No new notifications</li>');
          }
          $('.notification-count').hide();
        }

        addNetworkEventListener_count = 0;
        timestamp = response.timestamp; 

        //timestamp = response.totalSizeMB;
  
        $(".toast-time").html(`${convert_date_to_words(response.timestamp)}`);        

        response_valuationForms = responseValuationForms;
        response_reports = responseReports;
        response_images = responseImages;
        response_vehicles = responseVehicles;
      
        companies = response.companies;
        companyDetails = response.companyDetails;
        response_valuationTypes = response.valuationTypes;
        response_industryTypes = response.industryTypes;
        response_valuerUsers = response.valuerUsers;
        response_companyUsers = response.companyUsers;
        response_requests = response.requests;
        response_assignments = response.assignments;
        response_recentActivity = response.recentActivity;
        response_requestsVehicles = response.requestsVehicles;
        response_requestsReports = response.requestsReports;
        get_Location = response.getLocation;
        role = response.message.role;        

        var pending_requests_count = 0;
        var accepted_requests_count = 0;
        var rejected_requests_count = 0;
        response_requests.forEach(request => {
          if (request.Status == "Requested") {
            pending_requests_count++;
          } else if (request.Status == "Accepted") {
            accepted_requests_count++;
          } else if (request.Status == "Rejected") {
            rejected_requests_count++;
          }
        });
        
        $(".pending_requests_count").html(pending_requests_count);
        $(".accepted_requests_count").html(accepted_requests_count);
        $(".rejected_requests_count").html(rejected_requests_count);

        if (pending_requests_count > 0) {
            $('.valuation-requests-count').text(pending_requests_count).show();
        } else {
            $('.valuation-requests-count').hide();
        }
  
        response_valuationTypes.forEach(valuation => {
          $("#valuationType").append(`<option value="${valuation.ValuationName}" title="${valuation.Description}">${valuation.ValuationName}</option>`);
        });
        response_industryTypes.forEach(industry => {
          $("#industryType").append(`<option value="${industry.IndustryName}" title="${industry.Description}">${industry.IndustryName}</option>`);
        });  
        //$(".reject-button").html(`<i class="fa-solid fa-ban"></i> <span class="d-none d-sm-none d-md-inline">Reject</span>`);
        //$(".approve-button").html(`<i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span>`);        
        $(".accept-valuation-requests-btn").html(`Accept`);
        $(".reject-valuation-requests").html(`Reject`);
        $(".spinner-valuation").html(`Assign`);

        document.querySelector(".ApproverForms").classList.add("d-none");
        document.querySelector(".valuation_Form").classList.remove("d-none");

        if (response.message.role == "Senior valuer") {
          document.querySelector(".ApproverForms").classList.remove("d-none"); 
          document.querySelector("#report").style.display = "none";
          document.querySelector(".report-information").classList.remove("d-none");
          document.querySelector("#valuationForm").style.display = "block";
        }

        document.querySelector(".main-spinner-container").classList.add("d-none");
        document.querySelector(".camera-toggle").classList.remove("d-none");
        document.querySelector(".pdf-settings").classList.add("d-none");      
        document.querySelector(".principal-valuer-signature").classList.add("d-none");      
        document.querySelector(".company-settings").classList.add("d-none");
        document.querySelector("#companyInfo").classList.add("d-none");
        //document.querySelector(".storage-alert").classList.add("d-none");
        //document.querySelector(".loogg").innerHTML = `${JSON.stringify(response.companyUsers)}`;
        const companyUsers = response.companyUsers;
        const employeeSelect = document.getElementById('companyEmployee');
        const roleSelect = document.getElementById('companyEmployeeRole');
        employeeSelect.innerHTML = '<option value="">Select Company Employee</option>';
    
        companyUsers.forEach(employee => {
            // Populate employees dropdown
            let option = document.createElement('option');
            option.value = employee.UserID;
            option.textContent = employee.Username;
            option.dataset.role = employee.Role;  // Store role as data attribute
            employeeSelect.appendChild(option);

            // Populate roles dropdown
            let roleOption = document.createElement('option');
            roleOption.value = employee.Role;
            roleOption.textContent = employee.Role;
            // Avoid duplicate roles
            if (![...roleSelect.options].some(opt => opt.value === roleOption.value)) {
                roleSelect.appendChild(roleOption);
            }
        });

        employeeSelect.addEventListener('change', function() {
            const selectedEmployee = companyUsers.find(emp => emp.UserID === this.value);
            roleSelect.innerHTML = '<option value="' + selectedEmployee.Role + '">' + selectedEmployee.Role + '</option>';  // Reset roles dropdown
    
            companyUsers.forEach(employee => {  
              // Populate roles dropdown
              let roleOption = document.createElement('option');
              roleOption.value = employee.Role;
              roleOption.textContent = employee.Role;
              // Avoid duplicate roles
              if (![...roleSelect.options].some(opt => opt.value === roleOption.value)) {
                  roleSelect.appendChild(roleOption);
              }
            }); 

        });

        document.querySelectorAll(".vehicleChecklistManager").forEach(el => {
          el.classList.remove("d-none");        
        }); 

        if (response.message.role == "Elite Technician") {
          document.querySelector(".storage-message").innerHTML = 'contact your admin';

          document.querySelectorAll(".vehicleChecklistManager").forEach(el => {
            el.classList.add("d-none");        
          });       

          toggleDashboardVisibility('.valuer-dashboard', ['.individual-dashboard', '.approver-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard', '.carDealer-dashboard']);
        } else if (response.message.role == "Principal Valuer" || response.message.role == "Senior Valuer") {
          if (response.message.role == "Principal Valuer") {
            document.querySelector(".pdf-settings").classList.remove("d-none");
            document.querySelector(".principal-valuer-signature").classList.remove("d-none");
            //document.querySelector(".storage-alert").classList.remove("d-none");
          }
          document.querySelector(".storage-message").innerHTML = 'contact your admin';

          toggleDashboardVisibility('.approver-dashboard', ['.valuer-dashboard', '.individual-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard', '.carDealer-dashboard']);
        } else if (response.message.role == "Director") {
          document.querySelector("#companyInfo").classList.remove("d-none");
          //document.querySelector(".storage-alert").classList.remove("d-none");
          document.querySelector(".storage-message").innerHTML = 'update your plan';


          document.querySelector(".pdf-settings").classList.remove("d-none");
          document.querySelector(".company-settings").classList.remove("d-none");
          document.querySelector(".principal-valuer-signature").classList.remove("d-none");
          toggleDashboardVisibility('.approver-dashboard', ['.valuer-dashboard', '.individual-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard', '.carDealer-dashboard']);
          //toggleDashboardVisibility('.directorPrincipal-dashboard', ['.approver-dashboard', '.valuer-dashboard', '.individual-dashboard', '.appraiser-dashboard', '.carDealer-dashboard']);
        } else if (response.message.role == "Appraiser") {
          toggleDashboardVisibility('.appraiser-dashboard', ['.approver-dashboard', '.valuer-dashboard', '.individual-dashboard', '.directorPrincipal-dashboard', '.carDealer-dashboard']);
        } else if (response.message.role == "Individual" || response.message.role == "CarDealer" || response.message.role == "Micro Finance" || response.message.role == "Bank" || response.message.role == "Insurance") {
          
          if (response.message.role == "Individual") {
            document.querySelectorAll(".vehicleChecklistManager").forEach(el => {
              el.classList.add("d-none");        
            }); 
          }
          toggleDashboardVisibility('.individual-dashboard', ['.approver-dashboard', '.valuer-dashboard', '.carDealer-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard']);
          //toggleDashboardVisibility('.carDealer-dashboard', ['.approver-dashboard', '.valuer-dashboard', '.individual-dashboard', '.directorPrincipal-dashboard', '.appraiser-dashboard']);
        }

        //showSnackbar(JSON.stringify(response_reports));
        //alert(refresh_dashboard);
        //alert(refresh_dashboard);

        //if (local_refresh_dashboard) {
        if (refresh_dashboard) {

          refresh_dashboard = false;
          //document.querySelector(".main-spinner-container").classList.add("d-none");
          //alert(response_reports.length);
          //alert(response.message.messageError);

          displayValuationForms(response_valuationForms,response_reports,response.message.role);
          
          //document.querySelector(".loogg").innerHTML = `${JSON.stringify(response.message)}`;
          //document.querySelector(".loogg").innerHTML = `${JSON.stringify(response.message)}`;

          storageData = response.storage_stats;// Assuming response contains the necessary data

          var reports = response.reports;
          var requests = response.requests;
          var assignments = response.assignments;
          
          // To calculate on-time completion rate
          // Filter completed tasks in assignments (assuming 'status' is 'Completed' for completed tasks)
          var completedAssignments = assignments.filter(function(assignment) {
            return assignment.Status === 'Completed';  // Filter for completed tasks only
          });
          
          // Filter completed assignments that were on time (assuming you have a 'deadline' in 'RequestDate' and 'AssignmentDate' for comparison)
          var onTimeAssignments = completedAssignments.filter(function(assignment) {
            var request = requests.find(function(req) {
              return req.RequestID === assignment.RequestID;
            });
            var report = reports.find(function(rep) {
              return rep.VehicleID === assignment.VehicleID && rep.UserID === assignment.ValuerID;
            });
          
            if (report) {
              // Assuming 'RequestDate' is when the request was made, and 'AssignmentDate' is the task completion date
              var requestDate = new Date(report.ReportDate);
              var assignmentDate = new Date(assignment.AssignmentDate);
          
              // If the assignment date is before or equal to the request date (on-time)
              return assignmentDate <= requestDate;
            }
            return false;  // If no matching request found, consider it not on time
          });
          
          // Calculate the on-time completion rate
          var onTimeCompletionRate = (completedAssignments.length > 0) ? (onTimeAssignments.length / completedAssignments.length) * 100 : 0;
          
          // Display the rate (e.g., in a paragraph element with id 'on-time-rate')
          document.getElementById('on-time-rate').textContent = onTimeCompletionRate.toFixed(2) + '% on-time completion rate';          

          // Arrays for updated values (representing the data fetched from the database)
          var updatedStorageUsed = storageData.map(function(record) {
            return parseInt(record.total_storage_used, 10); // Convert string to integer
          });
          var updatedMaxStorage = storageData.map(function(record) {
            return parseInt(record.maximum_storage, 10); // Convert string to integer
          });
          var updatedValuations = storageData.map(function(record) {
            return parseInt(record.total_valuations, 10); // Convert string to integer
          });
          var newLabels = storageData.map(function(record) {
            return record.month_year; // Directly return the month as it is a string
          });
            
          const slider = document.getElementById('storageSlider');
          const storageLabel = document.getElementById('storageLabel');
          const planLabel = document.getElementById('planLabel');
          const priceLabel = document.getElementById('priceLabel');
          const storageAllocLabel = document.getElementById('storageAllocLabel');
          const storageValLabel = document.getElementById('storageValLabel');
          const storageVal2Label = document.getElementById('storageVal2Label');
          const reportButtons = document.querySelectorAll(".newReport, .resumeReport, .inspect-vehicles-requests");
          const storageAlert = document.querySelector(".storage-alert");

          // Generate the exponential mapping from slider value to storage value
          function calculateSliderValue(maxStorage) {
            const minStorage = 500; // 500 MB
            const maxSliderStorage = 2 * 1024; // 100 GB in MB
        
            // Calculate the slider position as a percentage
            const sliderValue = Math.log(maxStorage / minStorage) / Math.log(maxSliderStorage / minStorage) * 100;
        
            // Clamp the slider value between 0 and 100
            return Math.min(Math.max(sliderValue, 0), 100);
          }        
          function calculateStorageLabelValue(sliderValue) {
            // Convert slider value from MBs to human-readable format
            if (sliderValue * 1024 >= 1024 * 1024) {
                // Convert to GB
                return ((sliderValue * 1024 )/ (1024 * 1024)).toFixed(2) + ' GB';
            } else if (sliderValue * 1024 >= 1024) {
                // Convert to MB
                return ((sliderValue * 1024) / 1024).toFixed(2) + ' MB';
            } else {
                // Convert to KB
                return (sliderValue * 1024).toFixed(2) + ' KB';
            }
          }
          function updateProgressBar(percentage) {
            const progressBar = document.getElementById('dynamicProgressBar');
            const progressText = `${percentage}%`;
    
            // Update the width and text of the progress bar
            progressBar.style.width = progressText;
            progressBar.textContent = progressText;
            progressBar.setAttribute('aria-valuenow', percentage);
            document.querySelector(".storage-alert").classList.add("d-none");

            // Update color based on the percentage
            if (percentage >= 75) {
                progressBar.className = 'progress-bar text-bg-success'; // Green for 0-25%
            } else if (percentage >= 50) {
                progressBar.className = 'progress-bar text-bg-info'; // Blue for 26-50%
            } else if (percentage >= 25) {
                progressBar.className = 'progress-bar text-bg-warning'; // Yellow for 51-75%
            } else {
                progressBar.className = 'progress-bar text-bg-danger'; // Red for 76-100%
                if (response.message.role == "Principal Valuer" || response.message.role == "Director") {
                  document.querySelector(".storage-alert").classList.remove("d-none");
                }
            }
            
          }
          function calculatePayment(storageInBytes) {
        
            // Map storage ranges to pricing tiers
            if (storageInBytes <= 500 * 1024 * 1024) { // Up to 500 MB
                return {
                    plan: "Bronze",
                    price: "Ksh.4,500"
                };
            } else if (storageInBytes <= 2 * 1024 * 1024 * 1024) { // Up to 2 GB
                return {
                    plan: "Silver",
                    price: "Ksh.5,500"
                };
            } else if (storageInBytes <= 10 * 1024 * 1024 * 1024) { // Up to 10 GB
                return {
                    plan: "Gold",
                    price: "Ksh.7,000"
                };
            } else if (storageInBytes <= 20 * 1024 * 1024 * 1024) { // Up to 20 GB
                return {
                    plan: "Premium",
                    price: "Ksh.8,000"
                };
            } else if (storageInBytes <= 50 * 1024 * 1024 * 1024) { // Up to 50 GB
                return {
                    plan: "Enterprise",
                    price: "Ksh.10,100"
                };
            } else { // Up to 100 GB
                return {
                    plan: "Enterprise Plus",
                    price: "Ksh.12,000"
                };
            }
          }


          //alert(JSON.stringify(storageData));

          var percentageRemainingStorage = storageData.map(function(record) {
            var totalUsed = parseInt(record.total_storage_used, 10); // Convert to integer
            var maxStorage = parseInt(record.maximum_storage, 10); // Convert to integer
            var totalValuations = parseInt(record.total_valuations, 10); // Convert to integer
            
            var totalMaxValuations = Math.round((maxStorage / totalUsed) * totalValuations);
            storageValLabel.textContent = totalMaxValuations + ' valuations';

            storageVal2Label.textContent = totalValuations + ' valuations';

            //alert(totalMaxValuations + '==' + totalValuations);

            if (totalMaxValuations <= totalValuations && totalValuations !==0) {

              reportButtons.forEach(button => {
                button.addEventListener("click", function () {
                    // Show the message
                    storageAlert.classList.remove("d-none");
                    //
                    showSnackbar(`You are using <strong class="using-storage">${calculateStorageLabelValue(totalUsed)}</strong> of the <strong class="available-storage">${calculateStorageLabelValue(maxStorage)}</strong> of storage available to you.</span>`);
            
                    // Hide the message after 3 seconds
                    setTimeout(() => {
                        storageAlert.classList.add("d-none");
                    }, 5000);
                });
              });
            
            } else {
              reportButtons.forEach(button => {        
                button.addEventListener("click", function () {
                    // Open the modal properly
                    const newReportModal = new bootstrap.Modal(document.getElementById('newReportModal'));
                    newReportModal.show();
                    localStorage.setItem('requests_themePdfColor', ''); // Save to localStorage
                    localStorage.setItem('requests_themePdfFontSize', ''); // Save to localStorage
                    localStorage.setItem('requests_inAppCamera', ''); // Save to localStorage
                    localStorage.setItem('requests_videoSection', ''); // Save to localStorage
                    localStorage.setItem('requests_aiObjectsDetection', ''); // Save to localStorage
                    localStorage.setItem('requests_aiDamageDetection', ''); // Save to localStorage
                    localStorage.setItem('requests_aiValuePrediction', ''); // Save to localStorage
                    localStorage.setItem('requests_priorityStandard', ''); // Save to localStorage
                    localStorage.setItem('requests_priorityExpress', ''); // Save to localStorage
                    localStorage.setItem('requests_videoChecklistArray', ''); // Save to localStorage
                    //localStorage.setItem('videoChecklistArray', ''); // Save to localStorage

                });
              });
            }

            const initialSliderValue = calculateSliderValue(maxStorage);
            slider.value = initialSliderValue;

            //const storageLable = calculateStorageLabelValue(maxStorage);
            
            document.querySelector(".using-storage").innerHTML = `${calculateStorageLabelValue(totalUsed)}`;
            document.querySelector(".available-storage").innerHTML = `${calculateStorageLabelValue(maxStorage)}`;

            storageLabel.textContent = calculateStorageLabelValue(totalUsed);
            storageAllocLabel.textContent = calculateStorageLabelValue(maxStorage);

            var storageInBytes = (maxStorage * 1024 * 1024);
            const paymentDetails = calculatePayment(storageInBytes);

            planLabel.textContent = `Plan: ${paymentDetails.plan}`;
            priceLabel.textContent = `Price: ${paymentDetails.price}`;
            
            if (maxStorage === 0) {
              // Avoid division by zero, return 0% if maxStorage is 0
              return 0;
            }          
            // Calculate percentage remaining
            var remainingPercentage = (((maxStorage - totalUsed) / maxStorage) * 100).toFixed(2); // Format to 2 decimal places
            //var remainingPercentage = ((totalUsed / maxStorage) * 100).toFixed(2); // Format to 2 decimal places
            //alert(maxStorage + "-" +  totalUsed + "/" +  maxStorage);
            updateProgressBar(remainingPercentage);

            return remainingPercentage; // Return the calculated percentage
          });

          //alert('percentageRemainingStorage');

          //updateProgressBar(percentageRemainingStorage);
          //alert(updatedStorageUsed + " updatedMaxStorage " + updatedMaxStorage + " updatedValuations " + updatedValuations + " newLabels " + newLabels);

          //updateStorageChartData(updatedStorageUsed, updatedMaxStorage, updatedValuations, newLabels);
          //alert(updatedStorageUsed + " updatedMaxStorage " + updatedMaxStorage + " updatedValuations " + updatedValuations + " newLabels " + newLabels);

          const teamPerformanceData = response.teamPerformance;

          // Extract values for the chart
          const filteredData = teamPerformanceData.filter(item => parseInt(item.completed_tasks, 10) > 0);

          // Extract values for the chart from filtered data
          const performanceScores = filteredData.map(item => parseInt(item.performance_score, 10));
          const teamMemberNames = filteredData.map(item => item.team_member_name);
          const completedTasks = filteredData.map(item => parseInt(item.completed_tasks, 10));

          //alert(response.message.messageError);

          // Generate random colors
          const colors = filteredData.map(() => {
              const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
              return randomColor;
          }); 

          //alert('response.message.messageError');

          var selectedDetails = companyDetails.find(function(details) {
            return details.CompanyID == response.message.CompanyID;
          });
          if (selectedDetails) {
            maessa_up_Arr = selectedDetails.maessa_up_Arr;
          }
          let additional_checklist = {};
          let inspections_valuations = response.inspections_valuations || []; // Ensure it's an array          
          if (Array.isArray(inspections_valuations)) {
              var selectedInspectionsValuations = inspections_valuations.find(function(details) {
                  return details.user_id == response.message.CompanyID;
              });          
              if (selectedInspectionsValuations && selectedInspectionsValuations.additional_checklist) {
                  try {
                      additional_checklist = JSON.parse(selectedInspectionsValuations.additional_checklist); // ✅ Convert string to object
                  } catch (error) {
                      showSnackbar("Error parsing additional_checklist JSON:", error);
                  }
              }
          }
          response_inspections_requests_valuations = response.inspections_requests_valuations;
          //alert(JSON.stringify(response.inspections_requests_valuations));

          /**let additional_requests_checklist = {};
          response_inspections_requests_valuations = response.inspections_requests_valuations;
          let inspections_requests_valuations = response_inspections_requests_valuations || []; // Ensure it's an array          
          if (Array.isArray(inspections_requests_valuations)) {
              var selectedInspectionsValuations = inspections_requests_valuations.find(function(details) {
                  return details.user_id == response.message.CompanyID;
              });          
              if (selectedInspectionsValuations && selectedInspectionsValuations.additional_checklist) {
                  try {
                      additional_requests_checklist = JSON.parse(selectedInspectionsValuations.additional_checklist); // ✅ Convert string to object
                      maessa_up_Arr = selectedInspectionsValuations.maessa_up_Arr;

                  } catch (error) {
                      showSnackbar("Error parsing additional_requests_checklist JSON:", error);
                  }
              }
          }   */   

          const fontSizeSlider = document.getElementById('fontSizeSlider');
          const fontSizeValue = document.getElementById('fontSizeValue');

          localStorage.setItem('themePdfColor', additional_checklist.themePdfColor); // Save to localStorage
          localStorage.setItem('themePdfFontSize', additional_checklist.themePdfFontSize); // Save to localStorage

          fontSizeSlider.value = additional_checklist.themePdfFontSize;
          fontSizeValue.textContent = additional_checklist.themePdfFontSize + 'em';
          document.getElementById("colorPdfPicker").value = localStorage.getItem("themePdfColor");

          localStorage.setItem('inAppCamera', additional_checklist.inAppCamera); // Save to localStorage
          localStorage.setItem('videoSection', additional_checklist.videoSection); // Save to localStorage

          localStorage.setItem('aiObjectsDetection', additional_checklist.aiObjectsDetection); // Save to localStorage
          localStorage.setItem('aiDamageDetection', additional_checklist.aiDamageDetection); // Save to localStorage
          localStorage.setItem('aiValuePrediction', additional_checklist.aiValuePrediction); // Save to localStorage
          localStorage.setItem('priorityStandard', additional_checklist.priorityStandard); // Save to localStorage
          localStorage.setItem('priorityExpress', additional_checklist.priorityExpress); // Save to localStorage

          //alert(additional_checklist.videoChecklistArray);
          let videoChecklistString  = additional_checklist.videoChecklistArray || []; // Preserve selections

          if (videoChecklistString  !== null && videoChecklistString .length > 0) {
              let videoChecklistArray = videoChecklistString .split(","); // Convert string to array
              localStorage.setItem("videoChecklistArray", JSON.stringify(videoChecklistArray));
          }          

          document.getElementById("flexSwitchInAppCamera").checked = localStorage.getItem("inAppCamera") === "true";
          document.getElementById("30SecondVideoSwitch").checked = localStorage.getItem("videoSection") === "true";

          document.getElementById("aiObjectsDetection").checked = localStorage.getItem("aiObjectsDetection") === "true";
          document.getElementById("aiDamageDetectionSwitch").checked = localStorage.getItem("aiDamageDetection") === "true";
          document.getElementById("aiValuePrediction").checked = localStorage.getItem("aiValuePrediction") === "true";
          document.getElementById("priorityStandard").checked = localStorage.getItem("priorityStandard") === "true";
          document.getElementById("priorityExpress").checked = localStorage.getItem("priorityExpress") === "true";

          localStorage.setItem( 'vehicleSections', JSON.stringify(maessa_up_Arr.split(',').map(name => ({ name: name.trim() }))) );
          // Load from localStorage or initialize with defaults
          let sections = JSON.parse(localStorage.getItem('vehicleSections')) || maessa_up_Arr.split(',').map(name => ({ name: name.trim() }));
          
          document.getElementById('colorPdfPicker').addEventListener('input', function() {
            const newColor = this.value;
            //alert(newColor);
            document.querySelectorAll('.text-theme').forEach(el => {
                el.style.color = newColor;
            });
            localStorage.setItem('themePdfColor', newColor); // Save to localStorage
            saveSections();
          });
      
          // Handle font size change
          fontSizeSlider.addEventListener('input', function() {
              const newSize = this.value;
              document.querySelectorAll('.text-theme').forEach(el => {
                  el.style.fontSize = newSize + 'em';
              });
              fontSizeValue.textContent = newSize;
              localStorage.setItem('themePdfFontSize', newSize);
              saveSections();
          });

          document.getElementById("flexSwitchInAppCamera").addEventListener("change", function () {
            localStorage.setItem("inAppCamera", this.checked);
            saveSections();
          });
    
          document.getElementById("30SecondVideoSwitch").addEventListener("change", function () {
            localStorage.setItem("videoSection", this.checked);
            saveSections();
          });
          document.getElementById("aiObjectsDetection").addEventListener("change", function () {
            localStorage.setItem("aiObjectsDetection", this.checked);
            saveSections();
          });
          document.getElementById("aiDamageDetectionSwitch").addEventListener("change", function () {
            localStorage.setItem("aiDamageDetection", this.checked);
            saveSections();
          });
          document.getElementById("aiValuePrediction").addEventListener("change", function () {
            localStorage.setItem("aiValuePrediction", this.checked);
            saveSections();
          });
          document.getElementById("priorityStandard").addEventListener("change", function () {
            localStorage.setItem("priorityStandard", this.checked);
            localStorage.setItem("priorityExpress", '');
            saveSections();
          });
          document.getElementById("priorityExpress").addEventListener("change", function () {
            localStorage.setItem("priorityExpress", this.checked);
            localStorage.setItem("priorityStandard", '');
            saveSections();
          });
          const addSectionManager = document.querySelectorAll(".addSection");
          addSectionManager.forEach(button => {
              button.addEventListener("click", function () {
                  const newSectionName = document.getElementById('newSectionName').value.trim();
                  if (newSectionName) {
                      sections.push({ name: newSectionName });
                      saveSections(); // Save to localStorage
                      displaySections();
                      document.getElementById('newSectionName').value = ''; // Clear input
                  } else {
                      showSnackbar('Please enter a valid section name');
                  }
              });
          });          
          const vehicleChecklistManager = document.querySelectorAll(".vehicleChecklistManager");
          vehicleChecklistManager.forEach(button => {        
            button.addEventListener("click", function () {
                // Open the modal properly
                const checklistModalLabel = new bootstrap.Modal(document.getElementById('checklistModalLabel'));
                checklistModalLabel.show();
        
                // Initial display
                displaySections();
            });
          });
          // Function to save to localStorage
          function saveSections() {
              localStorage.setItem('vehicleSections', JSON.stringify(sections));
              maessa_up_Arr = sections.map(section => section.name).join(','); // Update maessa_up_Arr dynamically
              const formData = new FormData();
              formData.append('deviceID', localStorage.getItem('deviceID'));
              formData.append('userCompanyID', localStorage.getItem('userCompanyID'));
              formData.append('userRole', localStorage.getItem('userRole'));
              formData.append('maessa_up_Arr', maessa_up_Arr);
              
              formData.append('videoChecklistArray', JSON.parse(localStorage.getItem("videoChecklistArray")));

              formData.append('inAppCamera', localStorage.getItem('inAppCamera'));
              formData.append('videoSection', localStorage.getItem('videoSection'));
              formData.append('themePdfColor', localStorage.getItem('themePdfColor'));
              formData.append('themePdfFontSize', localStorage.getItem('themePdfFontSize'));

              formData.append('aiObjectsDetection', localStorage.getItem('aiObjectsDetection'));
              formData.append('aiDamageDetection', localStorage.getItem('aiDamageDetection'));
              formData.append('aiValuePrediction', localStorage.getItem('aiValuePrediction'));
              formData.append('priorityStandard', localStorage.getItem('priorityStandard'));
              formData.append('priorityExpress', localStorage.getItem('priorityExpress'));

              formData.append('action', "maessa_up_Arr");
              savePdfSettings(formData);//maessa_up_Arr

          }  
          // Function to display sections
          function displaySections() {
            const sectionsDiv = document.getElementById('checklist-sections-container');
            sectionsDiv.innerHTML = ''; // Clear previous content
        
            let savedVideoChecklist = JSON.parse(localStorage.getItem("videoChecklistArray")) || [];
            let videoChecklistArray = [...savedVideoChecklist]; // Preserve selections
            //alert(JSON.stringify(videoChecklistArray));

            sections.forEach((section, index) => {
                const div = document.createElement('div');
                div.className = 'checklist-section';
        
                div.innerHTML = `
                    <span id="section-text-${index}">${section.name}</span>
                    <input type="text" id="section-input-${index}" value="${section.name}" style="display: none;">
                    
                    <input type="checkbox" class="btn-check" id="btn-check-${index}" 
                        ${savedVideoChecklist.includes(section.name) ? "checked" : ""} autocomplete="off">
                    <label class="btn" for="btn-check-${index}">
                        <span class="d-none d-sm-none d-md-inline">10-Second </span>Video <span>🎥</span>
                    </label>
                    
                    <button class="checklist-edit-btn">Edit</button>
                    <button class="checklist-delete-btn">Delete</button>
                `;
        
                sectionsDiv.appendChild(div);
        
                // Selecting Elements
                const span = div.querySelector(`#section-text-${index}`);
                const input = div.querySelector(`#section-input-${index}`);
                const editBtn = div.querySelector(".checklist-edit-btn");
                const deleteBtn = div.querySelector(".checklist-delete-btn");
                const videoSwitch = div.querySelector(`#btn-check-${index}`);
        
                // Event Listeners
                span.addEventListener("click", () => toggleEdit(index));
                editBtn.addEventListener("click", () => toggleEdit(index));
                deleteBtn.addEventListener("click", () => removeSection(index));
                input.addEventListener("blur", () => saveEdit(index));
        
                // 🎥 Video Switch Event Listener
                if (videoSwitch) {
                    videoSwitch.addEventListener("change", () => {
                        const sectionName = section.name.trim(); // Ensure consistent name
        
                        if (videoSwitch.checked) {
                            showSnackbar(`🎬 10-Second Video enabled for: ${sectionName}`);
                            
                            // ✅ Prevent duplicates
                            if (!videoChecklistArray.includes(sectionName)) {
                                videoChecklistArray.push(sectionName);
                            }
                        } else {
                            showSnackbar(`⏹️ 10-Second Video disabled for: ${sectionName}`);
                            videoChecklistArray = videoChecklistArray.filter(item => item !== sectionName);
                        }
        
                        // Save updated array to localStorage
                        localStorage.setItem("videoChecklistArray", JSON.stringify(videoChecklistArray));
                        saveSections();
                    });
                } else {
                    showSnackbar(`❌ Switch button not found for section ${index}`);
                }
            });
          }               

          // Function to toggle editing mode
          function toggleEdit(index) {
              const span = document.getElementById(`section-text-${index}`);
              const input = document.getElementById(`section-input-${index}`);
  
              span.style.display = 'none';
              input.style.display = 'inline';
              input.focus();
          }  
          // Function to save edits on blur
          function saveEdit(index) {
              const span = document.getElementById(`section-text-${index}`);
              const input = document.getElementById(`section-input-${index}`);
  
              sections[index].name = input.value.trim();
              span.textContent = input.value.trim();
              span.style.display = 'inline';
              input.style.display = 'none';
  
              saveSections(); // Save to localStorage
          }  
          // Function to remove a section
          function removeSection(index) {
            sections.splice(index, 1);
            saveSections(); // Save to localStorage
            displaySections();
          }                    
          // Update the chart
          //alert("Update the chart");
          updateChartTeamPerformance(completedTasks, teamMemberNames, colors);
          updateStorageChartData(updatedStorageUsed, updatedMaxStorage, updatedValuations, newLabels);

        }
        
      }
    },
    error: function(xhr, status, error) {
      addNetworkEventListener_count = 0;
      showSnackbar(JSON.stringify(xhr));
    }
  });

}
function displayChart(dataAssignments,approvalStatusData) {
    // Destroy existing charts if they exist
    //alert('Destroy existing charts if they exist');
    if (approvalStatusChart) {
      approvalStatusChart.destroy();
    }
    if (assignmentStatusChart) {
      assignmentStatusChart.destroy();
    }
    // Example Chart.js script to render the Approval Status Chart    
    const ctxApproval = document.getElementById('approvalStatusChart').getContext('2d');
    approvalStatusChart = new Chart(ctxApproval, {
        type: 'pie',
        data: {
            labels: ['Approved', 'Pending', 'Rejected', 'Dispatched'],
            datasets: [{
                data: approvalStatusData, // Example data
                backgroundColor: ['#28a745', '#007bff', '#dc3545', '#17a2b8'],
            }]
        }
    });

    // Example Chart.js script to render the Assignment Status Chart
    const ctxAssignment = document.getElementById('assignmentStatusChart').getContext('2d');
    assignmentStatusChart = new Chart(ctxAssignment, {
        type: 'bar',
        data: {
            labels: ['Completed', 'Pending', 'In Progress'],
            datasets: [{
                label: '# of Assignments',
                data: dataAssignments, // Example data
                backgroundColor: ['#ffc107', '#007bff', '#28a745'],
            }]
        }
    });
}
// Function to update chart data
function updateCharts(newDataAssignments, newApprovalStatusData) {
  if (approvalStatusChart) {
      approvalStatusChart.data.datasets[0].data = newApprovalStatusData;
      approvalStatusChart.update();
  }
  if (assignmentStatusChart) {
      assignmentStatusChart.data.datasets[0].data = newDataAssignments;
      assignmentStatusChart.update();
  }
}
function displayValuationForms(valuation_Forms, _reports, role) {

  var approved_approvals_count = 0;
  var pending_approvals_count = 0;
  var rejected_approvals_count = 0;
  var completed_assignments_count = 0;
  var pending_assignments_count = 0;
  var in_progress_assignments_count = 0;
  
  var created_assignments_count = pending_assignments_count + completed_assignments_count;
  
  // Hide all popovers
  if (typeof $.fn.popover === 'function') {
    // Hide all active popovers
    $('[data-bs-toggle="popover"]').popover('hide');
  }

  created_assignments_count = 0;
  pending_assignments_count = 0;
  in_progress_assignments_count = 0;  
  completed_assignments_count = 0;

  $(".assignments-management").html('');
  $(".valuer-assignments-management").html('');
  //alert($(".valuation-requests").html());
  //$(".recent-approvals").html('');

  $(".vehicles-valuation-requests").html("");
  $(".individual-valuation-requests").html("");
  $(".valuation-requests").html("");

  $(".valuer-valuation-reports-list").html("");
  $(".approver-approved-valuation-reports-list").html("");
  $(".approver-pending-valuation-reports-list").html("");
  $(".approver-rejected-valuation-reports-list").html("");

  // Use DocumentFragment for better performance
  const assignmentsFragment = document.createDocumentFragment();
  const valuerAssignmentsFragment = document.createDocumentFragment();

  var client_name = '';
  response_assignments.forEach(assignments => {
    var valuer_small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
            <button type="button" class="btn btn-bd-primary inspect-vehicles-requests" AssignmentID="${assignments.AssignmentID}" VehicleID="${assignments.VehicleID}">Inpsect</button>
        </span>`;
    var bg_success = "success";
    if (assignments.Status == "Pending") {
        pending_assignments_count ++;
        bg_success = "warning";
    } else if (assignments.Status == "In Progress") {

        valuer_small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
          <button type="button" class="btn btn-bd-primary inspect-vehicles-requests" AssignmentID="${assignments.AssignmentID}" VehicleID="${assignments.VehicleID}">Continue</button>
        </span>`;
  
        in_progress_assignments_count ++;
        bg_success = "info";
        small_button_group = `<i class="fa-solid fa-check"></i>`;

    } else if (assignments.Status == "Completed") {
        completed_assignments_count ++;
        bg_success = "success";
        valuer_small_button_group = `<i class="fa-solid fa-check"></i>`;
    }
    var approver_name = '';
    var valuer_name = '';
    response_companyUsers.forEach(user => {    
      if (user.UserID == assignments.ValuerID) {
        valuer_name = user.Username;
      }      
    });
  
    client_name = '';
    response_requests.forEach(requests => {
      if (requests.VehicleID == assignments.VehicleID) {
        response_valuerUsers.forEach(user => {
          if (user.UserID == requests.UserID) {
            client_name = user.Username;
          }  
          if (user.UserID == assignments.ApproverID) {
            approver_name = user.Username;
          }       
        });
      }
    });
  
    var vehicle_name = '';
    var vehicleImagePath = '';
    var vehicleID = 0;
    var poster = '';

    response_requestsVehicles.forEach(vehicle => {    
      if (vehicle.VehicleID == assignments.VehicleID) {
        vehicle_name = vehicle.Make + ' ' + vehicle.Model;
        vehicleID = vehicle.VehicleID;
        response_images.forEach(image => {
          if (vehicle.VehicleID == image.VehicleID) {
            if (image.Description == "Right front") {
              poster = image.ImagePath;
            }

            if (image.Description == "Right front") {
              vehicleImagePath = ` 
                <img src="${image.ImagePath}" alt="${image.Description}" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
              `;
            } else if (isVideoFile(image.ImagePath)) {
              vehicleImagePath = ` 
                <video src="${image.ImagePath}" poster="${poster}" class="vehicle-image request_video_${image.VehicleID}" VehicleID="${vehicle.VehicleID}" style="object-fit: cover;" playsinline></video>
              `; 
              
              setTimeout(() => {
                // Get all video elements matching the class
                const videos = document.getElementsByClassName(`request_video_${image.VehicleID}`);
            
                if (videos.length > 0) {
                    Array.from(videos).forEach((video) => {
                        // Play on hover
                        video.addEventListener("mouseenter", () => {
                            video.play();
                        });
            
                        // Pause when mouse leaves
                        video.addEventListener("mouseleave", () => {
                            video.pause();
                        });
            
                        // Toggle play/pause on click
                        video.addEventListener("click", () => {
                            if (video.paused) {
                                video.play();
                            } else {
                                video.pause();
                            }
                        });
            
                        // Ensure video restarts when it ends
                        video.addEventListener("ended", () => {
                            video.currentTime = 0;
                        });
                    });
                }
              }, 100);
          
            }
          }
          if (vehicleImagePath == "" && image.Description == "Logbook photo") {
            vehicleImagePath = ` 
              <img src="${vehicle.LogbookFileURL}" alt="${image.Description}" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
            `;
          }
        });
        if (vehicleImagePath == "") {
          vehicleImagePath = ` 
            <img src="${vehicle.LogbookFileURL}" alt="Logbook photo" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
          `;
        }
      }
    });

    //alert(response_requestsVehicles.length);

    // Create list item with button group
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    listItem.innerHTML = `
      <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
      <span class="d-none d-sm-none d-md-inline">${vehicle_name}</span>
      <span class="d-none d-sm-none d-md-inline">${client_name}</span>
      <span class="d-none d-sm-none d-md-inline">${valuer_name}</span>
      <span><span class="d-inline d-sm-none">${vehicle_name}</span><br><span class="badge bg-${bg_success}">${assignments.Status}</span><br><span>${convert_date_to_words(assignments.AssignmentDate)}</span> </span>
      <span>${valuer_small_button_group}</span>`;
    assignmentsFragment.appendChild(listItem);

    //$(".assignments-management").append(listItem);

    const valuerAssignmentsManagementItem = document.createElement('li');
    valuerAssignmentsManagementItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    valuerAssignmentsManagementItem.innerHTML = `
      <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
      <span class="d-none d-sm-none d-md-inline">${vehicle_name}</span>
      <span class="d-none d-sm-none d-md-inline">${approver_name}</span>
      <span><span class="d-inline d-sm-none">${vehicle_name}</span><br><span class="badge bg-${bg_success}">${assignments.Status}</span><br><span>${convert_date_to_words(assignments.AssignmentDate)}</span></span>      
      <span>${valuer_small_button_group}</span>`;
    valuerAssignmentsFragment.appendChild(valuerAssignmentsManagementItem);
    //$(".valuer-assignments-management").append(valuerAssignmentsManagementItem);
  
  });

  if (pending_assignments_count > 0) {
      $('.valuation-assignments-count').text(pending_assignments_count).show();
  } else {
    $('.valuation-assignments-count').hide();
  }

  

  // Append fragments to the DOM in one go
  $(".assignments-management").append(assignmentsFragment);
  $(".valuer-assignments-management").append(valuerAssignmentsFragment);

  const recentActivityListFragment = document.createDocumentFragment();

  const recentActivityList = document.querySelector('.recent-activity');
  recentActivityList.innerHTML = "";
  response_recentActivity.forEach(activity => {   
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
      listItem.innerHTML = `<b>${activity.ActivityType}<b> : <span>${activity.Description}<span> <span>${convert_date_to_words(activity.Timestamp)}</span>`;
      recentActivityListFragment.appendChild(listItem);
  });
  recentActivityList.appendChild(recentActivityListFragment);

  created_assignments_count = pending_assignments_count + completed_assignments_count + in_progress_assignments_count;
  
  const valuationRequestItemFragment = document.createDocumentFragment();
  const individualValuationRequestslistItemFragment = document.createDocumentFragment();
  response_requests.forEach(requests => {
  
    var reportFileURL = '';

    response_requestsReports.forEach(report => {
      if (requests.VehicleID == report.VehicleID) {
          reportFileURL = report.ReportFileURL;
      }
    });      
  
    var valuerUsersItem = "";
    response_companyUsers.forEach(user => {    
        if (user.Role == "Elite Technician" || user.Role === "Senior Valuer" || user.Role === "Principal Valuer") {
            valuerUsersItem += `
                <span type="button" class="btn btn-bd-primary accept-valuation-requests mb-1" data-request-id="${requests.RequestID}" data-valuation-type-id="${requests.ValuationTypeID}" data-valuer-id="${user.UserID}"><span class="spinner-valuation"></span>${user.Username}</span><br>
            `;
        }
    });
  
    var individual_small_button_group = `
    <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
      <button type="button" class="btn btn-bd-primary edit-valuation-requests" RequestID="${requests.RequestID}" VehicleID="${requests.VehicleID}" ValuationTypeID="${requests.ValuationTypeID}" data-bs-toggle="modal" data-bs-target="#request-valuation-modal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
      <button type="button" class="btn btn-bd-primary delete-valuation-requests" RequestID="${requests.RequestID}" ValuationTypeID="${requests.ValuationTypeID}"><i class="fa-solid fa-trash-can"></i> <span class="d-none d-sm-none d-md-inline">Delete</span></button>
      <button type="button" class="btn btn-bd-primary auctions-valuation-requests" RequestID="${requests.RequestID}" ValuationTypeID="${requests.ValuationTypeID}"><i class="fa-solid fa-gavel"></i> <span class="d-none d-sm-none d-md-inline">Auction</span></button>

    </span>`;
  
    var small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
            <button type="button" class="btn btn-bd-primary accept-valuation-requests-btn" data-request-id="${requests.RequestID}" data-valuation-type-id="${requests.ValuationTypeID}" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="left" data-bs-html="true" data-bs-custom-class="custom-popover" data-bs-title="Assign Valuer" data-bs-content="${valuerUsersItem.replace(/"/g, '&quot;')}">Accept</button>
            <button type="button" class="btn btn-bd-primary reject-valuation-requests" RequestID="${requests.RequestID}" ValuationTypeID="${requests.ValuationTypeID}">Reject</button>
    </span>`; 
  
    var bg_success = "success";
    if (requests.Status == "Accepted") {
        bg_success = "info";
        small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
          <button type="button" class="btn btn-bd-primary reject-valuation-requests" RequestID="${requests.RequestID}" ValuationTypeID="${requests.ValuationTypeID}">Reject</button>
        </span>`;
    } else if (requests.Status == "Requested") {
        bg_success = "warning";
    } else if (requests.Status == "Rejected") {
        bg_success = "danger";
        small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
            <button type="button" class="btn btn-bd-primary accept-valuation-requests-btn" data-request-id="${requests.RequestID}" data-valuation-type-id="${requests.ValuationTypeID}" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="left" data-bs-html="true" data-bs-custom-class="custom-popover" data-bs-title="Assign Valuer" data-bs-content="${valuerUsersItem.replace(/"/g, '&quot;')}">Accept</button>
        </span>`;
    } else if (requests.Status == "Completed") {
      bg_success = "success";
      small_button_group = `<i class="fa-solid fa-check"></i>`;
      
      individual_small_button_group = `
        <span class="btn-group btn-group-sm" role="group" aria-label="Small button group">
          <button type="button" class="btn btn-bd-primary view-button" FormID="" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button" FormID=""><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
          <button type="button" class="btn btn-bd-primary copy-button" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>

        </span>`;
  
    }
    var ValuationName = "";
    response_valuationTypes.forEach(valuation => {
      if (valuation.ValuationTypeID == requests.ValuationTypeID) {
        ValuationName = valuation.ValuationName; 
      }
    });

    var vehicle_name = "";
    var vehicleID = 0;
    var vehicleImagePath = "";
    var poster = '';

    const requestsVehiclesListItemFragment = document.createDocumentFragment();
    response_requestsVehicles.forEach(vehicle => {    
      if (vehicle.VehicleID == requests.VehicleID) {
        vehicle_name = vehicle.Make + ' ' + vehicle.Model;

        response_images.forEach(image => {
          if (vehicle.VehicleID == image.VehicleID) {
            if (image.Description == "Right front") {
              poster = image.ImagePath;
            }
            if (image.Description == "Right front") {
              vehicleImagePath = ` 
                <img src="${image.ImagePath}" alt="${image.Description}" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
              `;
            } else if (isVideoFile(image.ImagePath)) {
              vehicleImagePath = ` 
                <video src="${image.ImagePath}" poster="${poster}" class="vehicle-image requestsVehicles_video_${image.VehicleID}" VehicleID="${vehicle.VehicleID}" style="object-fit: cover;" playsinline></video>
              `;      
              setTimeout(() => {
                // Get all video elements matching the class
                const videos = document.getElementsByClassName(`requestsVehicles_video_${image.VehicleID}`);
            
                if (videos.length > 0) {
                    Array.from(videos).forEach((video) => {
                        // Play on hover
                        video.addEventListener("mouseenter", () => {
                            video.play();
                        });
            
                        // Pause when mouse leaves
                        video.addEventListener("mouseleave", () => {
                            video.pause();
                        });
            
                        // Toggle play/pause on click
                        video.addEventListener("click", () => {
                            if (video.paused) {
                                video.play();
                            } else {
                                video.pause();
                            }
                        });
            
                        // Ensure video restarts when it ends
                        video.addEventListener("ended", () => {
                            video.currentTime = 0;
                        });
                    });
                }
              }, 100); 
          
            }

          }
          if (vehicleImagePath == "" && image.Description == "Logbook photo") {
            vehicleImagePath = ` 
              <img src="${vehicle.LogbookFileURL}" alt="${image.Description}" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
            `;
          }
        });
    
        if (vehicleImagePath == "") {
          vehicleImagePath = ` 
            <img src="${vehicle.LogbookFileURL}" alt="Logbook photo" class="vehicle-image" VehicleID="${vehicle.VehicleID}">
          `;
        }
        // Create list item with button group
        
        const requestsVehiclesListItem = document.createElement('li');
        requestsVehiclesListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
        requestsVehiclesListItem.innerHTML = `        
        <span class="vehicleImageLogo" VehicleID="${vehicle.VehicleID}">${vehicleImagePath}</span>
        <span class="d-none d-sm-none d-md-inline">${vehicle.Make} ${vehicle.Model}</span>
        <span class="d-none d-sm-none d-md-inline">${vehicle.Year}</span>
        <span class="d-none d-sm-none d-md-inline">${addCommasToNumber(vehicle.Mileage)}</span>
        <span class="d-none d-sm-none d-md-inline">${vehicle.Color}</span>
        <span><span class="d-inline d-sm-none">${vehicle.Make} ${vehicle.Model}</span><br><span class="badge bg-${bg_success}">${requests.Status}</span><br><span>${convert_date_to_words(requests.RequestDate)}</span></span>        
        <span>${individual_small_button_group}</span>`;
        requestsVehiclesListItemFragment.append(requestsVehiclesListItem);
      }
    });
    $(".vehicles-valuation-requests").append(requestsVehiclesListItemFragment);    
  
    const valuationRequestItem = document.createElement('li');
    valuationRequestItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    valuationRequestItem.innerHTML = `
      <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
      <span class="d-none d-sm-none d-md-inline">${vehicle_name}</span>
      <span class="d-none d-sm-none d-md-inline">${ValuationName}</span>
      <span><span class="d-inline d-sm-none">${vehicle_name}</span><br><span class="badge bg-${bg_success}">${requests.Status}</span><br><span>${convert_date_to_words(requests.RequestDate)}</span></span>      
      <span>${small_button_group}</span>`;
    valuationRequestItemFragment.append(valuationRequestItem);
    
    // Create list item with button group
    const individualValuationRequestslistItem = document.createElement('li');
    individualValuationRequestslistItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    individualValuationRequestslistItem.innerHTML = `
      <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
      <span class="d-none d-sm-none d-md-inline">${vehicle_name}</span>
      <span class="d-none d-sm-none d-md-inline">${ValuationName}</span>
      <span class="d-none d-sm-none d-md-inline">${requests.IndustryType}</span>
      <span><span class="d-inline d-sm-none">${vehicle_name}</span><br><span class="badge bg-${bg_success}">${requests.Status}</span><br><span>${convert_date_to_words(requests.RequestDate)}</span></span>      
      <span>${individual_small_button_group}</span>`;
    individualValuationRequestslistItemFragment.append(individualValuationRequestslistItem);

  });

  $(".individual-valuation-requests").append(individualValuationRequestslistItemFragment);
  $(".valuation-requests").append(valuationRequestItemFragment);

  // Handle clicks inside the popover and retrieve attributes
  if (addEventListener_count === 0) {
    //addEventListener_count = 1;
    // Initialize Bootstrap popovers after adding the buttons
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        const popover = new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'manual',
            html: true,
            placement: 'left',
            customClass: 'custom-popover bg-dark text-light',
        });
  
        popoverTriggerEl.addEventListener('click', function (event) {
            event.stopPropagation();
  
            if (popoverTriggerEl.classList.contains('popover-shown')) {
                popover.hide();
                popoverTriggerEl.classList.remove('popover-shown');
            } else {
                popover.show();
                popoverTriggerEl.classList.add('popover-shown');
            }
        });
        return popover;
    });
  
    // Manage popover visibility
    document.addEventListener('click', function (event) {
        const target = event.target;
        const isInsidePopover = target.closest('.popover') !== null;
  
        if (!isInsidePopover) {
            // Hide all popovers when clicking outside
            popoverList.forEach(function (popover) {
                popover.hide();
                popover._element.classList.remove('popover-shown');
            });
        }
    });

    // Listen for when the popover is shown
    document.addEventListener('shown.bs.popover', function (event) {

        const popoverId = event.target.getAttribute('aria-describedby');
        const popoverElement = document.getElementById(popoverId);
        const requestId = event.target.getAttribute('data-request-id');
        const valuationTypeId = event.target.getAttribute('data-valuation-type-id');
        
        let valuerUsersItem = "";
        response_companyUsers.forEach(user => {
            if (user.Role === "Elite Technician" || user.Role === "Senior Valuer" || user.Role === "Principal Valuer") {
                valuerUsersItem += `
                    <span type="button" class="btn btn-bd-primary accept-valuation-requests mb-1" 
                          data-request-id="${requestId}" 
                          data-valuation-type-id="${valuationTypeId}" 
                          data-valuer-id="${user.UserID}">
                          ${user.Username}
                    </span><br>`;
            }
        });
  
        // Use setTimeout to ensure content is injected after popover is fully shown
        setTimeout(function() {
          // Inspect the popoverElement to find the appropriate class or structure
          //alert(addEventListener_count);

          const popoverContent = popoverElement.querySelector('.popover-body') || popoverElement.querySelector('.popover-content');
          if (popoverContent) {

              popoverContent.innerHTML = valuerUsersItem;
          } else {
              //alert('Popover content element not found');
          }
        }, 1000); // Adjust delay if necessary
    });
  }
  
  // Initialize counters
  var pending_valuations_count = 0;
  var accepted_valuations_count = 0;
  var rejected_valuations_count = 0;
  var pending_approvals_count = 0;
  var approved_approvals_count = 0;
  var rejected_approvals_count = 0;
  var dispatched_approvals_count = 0;
  var created_assignments_count = 0;

  const recentApprovalsItemFragment = document.createDocumentFragment();
  const valuationReportsListItemFragment = document.createDocumentFragment();
  const pendingValuationReportsListItemFragment = document.createDocumentFragment();
  const approvedValuationReportsListItemFragment = document.createDocumentFragment();
  const rejectedValuationReportsListItemFragment = document.createDocumentFragment();
    
  // Create a dictionary for reports based on FormID
  const reportsByFormID = {};
  _reports.forEach(report => {
      reportsByFormID[report.FormID] = report;
  }); 
  
  valuation_Forms.forEach(valuation => {
    let reportFileURL = "";
    let approvalStatus = "";
    let reportID = 0;
    let vehicleID = 0;
    let vehicleImagePath = "";

    // Find the corresponding report for the valuation
    const report = reportsByFormID[valuation.FormID];
    if (report) {
        reportFileURL = report.ReportFileURL;
        approvalStatus = report.ApprovalStatus;
        reportID = report.ReportID;
        vehicleID = report.VehicleID;
    }
    
    // Set background class based on approval status
    let bg_class = "success";
    switch (approvalStatus) {
        case "Approved":
            approved_approvals_count++;
            accepted_valuations_count++;
            bg_class = "success";
            break;
        case "Pending":
            pending_approvals_count++;
            pending_valuations_count++;
            bg_class = "warning";
            break;
        case "Rejected":
            rejected_approvals_count++;
            rejected_valuations_count++;
            bg_class = "danger";
            break;
        case "Dispatched":
            dispatched_approvals_count++;
            bg_class = "info";
            break;
    }

    var button_group = `
    <button type="button" class="btn btn-bd-primary reject-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-ban"></i> <span class="d-none d-sm-none d-md-inline">Reject</span></button>
    <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
    <button type="button" class="btn btn-bd-primary edit-button" FormID="${valuation.FormID}" data-bs-toggle="modal" data-bs-target="#newReportModal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
    <button type="button" class="btn btn-bd-primary approve-button" FormID="${valuation.FormID}"><i class="fa-solid fa-thumbs-up"></i> <span class="d-none d-sm-none d-md-inline">Approve</span></button>
    <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
    <button type="button" class="btn btn-bd-primary copy-button d-none d-sm-none d-md-inline" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
    `;
    if (approvalStatus == "Approved"  || approvalStatus == "Dispatched") {
      button_group = `
          <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button btn-outline-primary" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
          <button type="button" class="btn btn-bd-primary copy-button" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
      `;
      if (role === "Principal Valuer" || role === "Director") {
        button_group = `
          <button type="button" class="btn btn-bd-primary reject-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-ban"></i> <span class="d-none d-sm-none d-md-inline">Reject</span></button>
          <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <button type="button" class="btn btn-bd-primary edit-button" FormID="${valuation.FormID}" data-bs-toggle="modal" data-bs-target="#newReportModal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
          <button type="button" class="btn btn-bd-primary approve-button" FormID="${valuation.FormID}"><i class="fa-solid fa-thumbs-up"></i> <span class="d-none d-sm-none d-md-inline">Approve</span></button>
          <button type="button" class="btn btn-bd-primary dispatch-button" FormID="${valuation.FormID}"><i class="fa-solid fa-paper-plane"></i> <span class="d-none d-sm-none d-md-inline">Dispatch</span></button>
          <button type="button" class="btn btn-bd-primary auctions-valuation-requests" RequestID="${valuation.FormID}"><i class="fa-solid fa-gavel"></i> <span class="d-none d-sm-none d-md-inline">Auction</span></button>

        `;
      }
      if (approvalStatus == "Dispatched") {
        button_group = `
          <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button btn-outline-primary" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
          <button type="button" class="btn btn-bd-primary copy-button" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
          <button type="button" class="btn btn-bd-primary auctions-valuation-requests" RequestID="${valuation.FormID}"><i class="fa-solid fa-gavel"></i> <span class="d-none d-sm-none d-md-inline">Auction</span></button>

        `;
        if (role === "Director") {
          button_group = `
            <button type="button" class="btn btn-bd-primary reject-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-ban"></i> <span class="d-none d-sm-none d-md-inline">Reject</span></button>
            <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
            <button type="button" class="btn btn-bd-primary edit-button" FormID="${valuation.FormID}" data-bs-toggle="modal" data-bs-target="#newReportModal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
            <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
            <button type="button" class="btn btn-bd-primary auctions-valuation-requests" RequestID="${valuation.FormID}"><i class="fa-solid fa-gavel"></i> <span class="d-none d-sm-none d-md-inline">Auction</span></button>

          `;
        }
      }
      if (role == "Elite Technician") {
          button_group = `
              <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
              <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button btn-outline-primary d-none" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
              <button type="button" class="btn btn-bd-primary copy-button d-none" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
          `;        
      }
    } else if (role == "Elite Technician") {
      button_group = `
          <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button btn-outline-primary d-none" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
          <button type="button" class="btn btn-bd-primary copy-button d-none" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
      `;
      if (approvalStatus == "Rejected" || approvalStatus == "Pending") {
          button_group = `
              <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
              <button type="button" class="btn btn-bd-primary edit-button" FormID="${valuation.FormID}" data-bs-toggle="modal" data-bs-target="#newReportModal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
              <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button d-none" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
              <button type="button" class="btn btn-bd-primary copy-button d-none" FormID="" ReportFileURL="${reportFileURL}"><i class="fa-solid fa-clipboard"></i> <span class="d-none d-sm-none d-md-inline">Copy</span></button>
          `;
      }
    } else if (approvalStatus == "Rejected") {
      button_group = `
          <button type="button" class="btn btn-bd-primary delete-valuation-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-trash"></i> <span class="d-none d-sm-none d-md-inline">Delete</span></button>
          <button type="button" class="btn btn-bd-primary view-button" FormID="${valuation.FormID}" ReportFileURL="${reportFileURL}" data-bs-toggle="modal" data-bs-target="#example_Modal"><i class="fa-solid fa-eye"></i> <span class="d-none d-sm-none d-md-inline">View</span></button>
          <button type="button" class="btn btn-bd-primary edit-button" FormID="${valuation.FormID}" data-bs-toggle="modal" data-bs-target="#newReportModal"><i class="fa-solid fa-pen-to-square"></i> <span class="d-none d-sm-none d-md-inline">Edit</span></button>
          <button type="button" class="btn btn-bd-primary approve-button" FormID="${valuation.FormID}"><i class="fa-solid fa-thumbs-up"></i> <span class="d-none d-sm-none d-md-inline">Approve</span></button>
          <a href="${reportFileURL}" target="_blank" type="button" class="btn btn-bd-primary download-button d-none d-sm-none d-md-inline" FormID="${valuation.FormID}"><i class="fa-solid fa-download"></i> <span class="d-none d-sm-none d-md-inline">Download</span></a>
      `;
    }
    var poster = '';

    response_images.forEach(image => {
      if (vehicleID == image.VehicleID) {
        if (image.Description == "Right front") {
          poster = image.ImagePath;
        }
        //alert(poster);
        if (image.Description == "Right front") {
          vehicleImagePath = ` 
            <img src="${image.ImagePath}" alt="${image.Description}" class="vehicle-image" VehicleID="${vehicleID}">
          `;
        } else if (isVideoFile(image.ImagePath)) {
          vehicleImagePath = ` 
            <video id="video_${image.VehicleID}" src="${image.ImagePath}" poster="${poster}" class="vehicle-image video_${image.VehicleID}" VehicleID="${vehicleID}" style="object-fit: cover;" playsinline></video>
          `;
          setTimeout(() => {
            // Get all video elements matching the class
            const videos = document.getElementsByClassName(`video_${image.VehicleID}`);
        
            if (videos.length > 0) {
                Array.from(videos).forEach((video) => {
                    // Play on hover
                    video.addEventListener("mouseenter", () => {
                        video.play();
                    });
        
                    // Pause when mouse leaves
                    video.addEventListener("mouseleave", () => {
                        video.pause();
                    });
        
                    // Toggle play/pause on click
                    video.addEventListener("click", () => {
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    });
        
                    // Ensure video restarts when it ends
                    video.addEventListener("ended", () => {
                        video.currentTime = 0;
                    });
                });
            }
          }, 100);
      
        }        
      }
    });

    // Create table row for recent approvals
    const recentApprovalsItem = document.createElement('li');
    recentApprovalsItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    recentApprovalsItem.innerHTML = `
        <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
        <span class="d-none d-sm-none d-md-inline">${valuation.Make} <span class="d-none d-sm-none d-md-inline">${valuation.Model} ${valuation.ModelType}</span> ${valuation.RegistrationNo}</span>
        <span class="d-none d-sm-none d-md-inline">${valuation.Examiner}</span>
        <span><span class="d-inline d-sm-none">${valuation.Make} ${valuation.Model}</span><br><span class="badge bg-${bg_class}">${approvalStatus}</span><br><span>${convert_date_to_words(valuation.CreatedAt)}</span></span>
        <span><div class="btn-group" role="group">${button_group}</div></span>
    `;
    recentApprovalsItemFragment.append(recentApprovalsItem);
    
    // Create list item with button group
    const valuationReportsListItem = document.createElement('li');
    valuationReportsListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-dark', 'text-light');
    valuationReportsListItem.innerHTML = `
        <span class="vehicleImageLogo" VehicleID="${vehicleID}">${vehicleImagePath}</span>
        <span class="d-none d-sm-none d-md-inline">${valuation.Make} <span class="d-none d-sm-none d-md-inline">${valuation.Model} ${valuation.ModelType}</span> ${valuation.RegistrationNo}</span>
        <span><span class="d-none d-sm-none d-md-inline">${valuation.MarketValue}</span></span>
        <span class="d-none d-sm-none d-md-inline"><p>${valuation.DateOfInspection}</p></span>
        <span class="d-none d-sm-none d-md-inline"><p>${valuation.Examiner}</p></span>
        <span class="d-none"><p>${valuation.Destination}</p></span>
        <span><p><span class="d-inline d-sm-none">${valuation.Make} ${valuation.Model}</span><br><span class="d-none d-sm-none d-md-inline"></span><span class="badge bg-${bg_class}">${approvalStatus}</span><br><span>${convert_date_to_words(valuation.CreatedAt)}</span></p></span>
        <span><div class="btn-group" role="group">${button_group}</div></span>
    `;
    if (role === "Elite Technician") {
      valuationReportsListItemFragment.append(valuationReportsListItem);
    } else if (role === "Principal Valuer" || role === "Senior Valuer" || role === "Director") {
      if (approvalStatus !== "Rejected") {
        if (approvalStatus === "Approved" || approvalStatus === "Dispatched") {
          approvedValuationReportsListItemFragment.append(valuationReportsListItem);
        } else {
          pendingValuationReportsListItemFragment.append(valuationReportsListItem);
        }
      } else {
        rejectedValuationReportsListItemFragment.append(valuationReportsListItem);
      }
    }
  
  });  
  
  // Update the HTML counters (only once outside the loop)
  $(".pending_approvals_count").html(pending_approvals_count);
  $(".approved_approvals_count").html(approved_approvals_count);
  $(".rejected_approvals_count").html(rejected_approvals_count);
  $(".created_assignments_count").html(created_assignments_count);
  $(".accepted_valuations_count").html(accepted_valuations_count);
  $(".pending_valuations_count").html(pending_valuations_count);
  $(".rejected_valuations_count").html(rejected_valuations_count);

  if (pending_approvals_count > 0) {
      $('.valuation-reports-count').text(pending_approvals_count).show();
  } else {
    $('.valuation-reports-count').hide();
  }

  $(".recent-approvals").empty().append(recentApprovalsItemFragment); // Append a clone to .recent-approvals
  //$(".recent-approvals").append(recentApprovalsItemFragment.cloneNode(true)); // Append a clone to .recent-approvals
  //$(".valuer-recent-approvals").append(recentApprovalsItemFragment.cloneNode(true)); // Append another clone to .valuer-recent-approvals
  //$(".valuer-recent-approvals").empty().append(recentApprovalsItemFragment.cloneNode(true));

  //$(".recent-approvals").append(recentApprovalsItemFragment);
  //alert(recentApprovalsItemFragment);
  //$(".valuer-recent-approvals").append(recentApprovalsItemFragment);

  $(".valuer-valuation-reports-list").append(valuationReportsListItemFragment);
  $(".approver-pending-valuation-reports-list").append(pendingValuationReportsListItemFragment);
  $(".approver-approved-valuation-reports-list").append(approvedValuationReportsListItemFragment);
  $(".approver-rejected-valuation-reports-list").append(rejectedValuationReportsListItemFragment);

  $(".toast-body").html(`${JSON.stringify(valuation_Forms)}`);
  const toastLiveExample = document.getElementById('liveToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample); 

  //toastBootstrap.show();    
  //document.querySelector(".toast-container").classList.remove("d-none");  

  var dataAssignments = [completed_assignments_count, pending_assignments_count, in_progress_assignments_count];//['Completed', 'Pending']
  var approvalStatusData = [approved_approvals_count, pending_approvals_count, rejected_approvals_count, dispatched_approvals_count];//['Approved', 'Pending', 'Rejected']
  
  $("#approvalStatusChart").html("");
  $("#assignmentStatusChart").html("");
  
  updateCharts(dataAssignments, approvalStatusData);

  changeBackgroundColor(localStorage.getItem('themeColor'));

  //const downloadButton = document.querySelector('.download-button');
  // Example usage
  //disableButton(downloadButton);
  
}
function downloadReport(pdfUrl) {
  var url = pdfUrl; // Replace with your PDF URL
  $.ajax({
      url: url,
      method: 'GET',
      xhrFields: {
          responseType: 'blob'
      },
      success: function(data, status, xhr){
        var contentType = xhr.getResponseHeader("Content-Type");
        if (contentType === "application/pdf") {
            var blob = new Blob([data], { type: 'application/pdf' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'file.pdf'; // Replace 'file.pdf' with the desired file name
            link.click();
        } else {
            alert("Failed to download PDF file. The content is not a PDF.");
        }
      },
      error: function() {
        alert("Failed to download file.");
      }
  });


}
function callonlineGimboUsername() {
  setTimeout(() => {
    //onlineGimbo(localStorage.getItem('onlineGimboUsername'),localStorage.getItem('response_arybittrack_email'),localStorage.getItem('response_arybittrack_password'),"loginUser", "");
    callonlineGimboUsername();
  }, 5000);
}
function generateCorporateRefNo() {
    const date = new Date();    
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `CRN${year}${month}${day}${hours}${minutes}${seconds}${randomNum}`;
}
function generateSerialNo() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 8;
  let serialNo = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      serialNo += characters[randomIndex];
  }

  return serialNo;
}
function mopal(params) {
  addNetworkEventListener_count = 1;
  $.ajax({
    url: server_Url +  'mopal.php',
    method: 'POST', // You can change the HTTP method to GET if needed
    data: params,
    dataType: 'json', // Change the dataType to the expected response type
    success: function(response) {
      //addNetworkEventListener_count = 0;
      timestamp = response.timestamp;
      if (response.result.success) {
        showSnackbar(response.status);
        if (response.result.message.status) {
          $("#upload_from_file_container_help").html('<span class="text-success">' + response.result.message.response + '</span>');

        } else {
          $("#upload_from_file_container_help").html('<span class="text-danger">' + response.result.message.response + '</span>');
        }
      } else {
        $("#upload_from_file_container_help").html('<span class="text-danger">' + response.result.message + '</span>');
      }
    }, 
    error: function(xhr, status, error) {
      //addNetworkEventListener_count = 0;
      $("#upload_from_file_container_help").html('<span class="text-success">' + JSON.stringify(xhr) + '</span>');
    }
  });
}
function request_camPermissions() {
  var permissions = cordova.plugins.permissions;
  var permissionsToRequest = [
    permissions.CAMERA
  ];
  permissions.requestPermissions(permissionsToRequest, function (status) {
      if ( status[permissions.CAMERA] === permissions.GRANTED) {
        // Do something with the microphone and camera
        
        $('.camcameraPreview').remove();
        navigator.mediaDevices.getUserMedia({ video: {facingMode: {exact: 'environment'}} }).then(function (stream) {
          var user_chat = '<div class="message parker camcameraPreview "><video id="cameraPreview" class="img-fluid"></video></div>';
          $('.messages').append(user_chat);
          var videoElement = document.getElementById('cameraPreview');
          videoElement.srcObject = stream;
          videoElement.play();
      
          var useDivr_chat = '<div id="cameraDivPreview" class="message stark cDivPreview mb-4">Capturing in 3 sec...</div>';
          $('.messages').append(useDivr_chat);
          window.location.href = "#cameraDivPreview";

          videoElement.onloadedmetadata = function () {
            // Create a canvas element to draw the captured frame
            setTimeout(() => {
              var canvas = document.createElement('canvas');
              canvas.width = videoElement.videoWidth;
              canvas.height = videoElement.videoHeight;
        
              // Draw the current frame from the video onto the canvas
              var context = canvas.getContext('2d');
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
              // Get the data URL representation of the canvas content
              var base64Image = canvas.toDataURL('image/png'); 

              //var binaryString = window.atob(base64Image);

              // Do something with the captured image (e.g., send it to a server)
              $('.camcameraPreview').remove(); 
              $('.cDivPreview').remove(); 

              var user_chat = '<div class="message parker"><img id="base64Image" src="' + base64Image + '" class="img-fluid" alt="' + base64Image + '"></div>';
              $('.messages').append(user_chat);
              //data:image/png;base64,
              var base64 = base64Image.replace("data:image/png;base64,", " ");

              param1 = "cam";
              param2 = base64;                  
              var mopal_chat = '<div id="mopal_chat_typing" class="message stark mopal_chat_typing"><div class="typing typing-1"></div><div class="typing typing-2"></div><div class="typing typing-3"></div></div>';
              $('.messages').append(mopal_chat);
              window.location.href = "#mopal_chat_typing";
              
              // Stop the video stream
              stream.getTracks().forEach(function (track) {
                track.stop();
              });      
            }, 3000);

            //mySnackbar("Capturing in 3 sec...");      
          };    
           
        }) .catch(function (error) {
          alert('Camera preview error: ' + error.message);
          // Handle camera preview error
        });
      } else {
        alert('permissions denied');
      }
  }, function (err) {
    alert(JSON.stringify(err));

  });
}
function convertNumberToWords(amount) {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

  function numberToWords(num) {
    if (num === 0) return "Zero";
    if (num < 0) return "Negative " + numberToWords(Math.abs(num));
    
    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            words = convertHundreds(num % 1000) + scales[scaleIndex] + " " + words;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }
    
    return words.trim();
  }

  function convertHundreds(num) {
    let result = "";

    if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
    }

    if (num >= 20) {
        result += tens[Math.floor(num / 10)] + " ";
        num %= 10;
    }

    if (num > 0) {
        result += ones[num] + " ";
    }

    return result;
  }
  return numberToWords(amount);// Output: "One Million Two Hundred Thirty-Four Thousand Five Hundred Sixty-Seven"  
}
function generateDeviceId() {
  const timestamp = new Date().getTime();  
  return (
    Math.random().toString(36).substring(2, 15) + timestamp +
    Math.random().toString(36).substring(2, 15)
  );
}
function gettimeOfInspection() {
  const date = new Date();
  const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  };
  const formattedDate = date.toLocaleString('en-US', options).replace(/(GMT[+-]\d{4} \(.*\))/, '');
  return formattedDate;
  
}
function toggleDashboardVisibility(showSelector, hideSelectors) {
  // Show elements that match the showSelector
  document.querySelectorAll(showSelector).forEach(element => {
    element.classList.remove('d-none');
  });
  
  // Hide elements that match the hideSelectors
  hideSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add('d-none');
    });
  });
}
function showSuggestions(inputField, suggestionField, data) {
  const input = inputField.val().toLowerCase();
  const suggestions = data.filter(item => item.toLowerCase().includes(input));
  suggestionField.empty();

  if (input !== '') {
      suggestions.forEach(suggestion => {
          const suggestionItem = $('<div class="suggestion-item"></div>');
          suggestionItem.text(suggestion);
          suggestionItem.click(() => {
              inputField.val(suggestion);
              suggestionField.empty();
          });
          suggestionField.append(suggestionItem);
      });
      suggestionField.show();
  } else {
      suggestionField.hide();
  }
}
function convert_date_to_words(dateString) {
  const date = new Date(dateString);
  const now = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    if (seconds < 0) {
      return 0 + ' seconds ago';
    } else {
      return seconds + ' seconds ago';
    }
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? '1 minute ago' : minutes + ' minutes ago';
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours === 1 ? '1 hour ago' : hours + ' hours ago';
  } else if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return days === 1 ? '1 day ago' : days + ' days ago';
  } else {
    const weeks = Math.floor(seconds / 604800);
    return weeks === 1 ? '1 week ago' : weeks + ' weeks ago';
  }
} 
function addCommasToNumber(number) {
  // Convert the number to a string
  let numStr = number.toString();
  
  // Use a regular expression to add commas every three digits from the right
  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return numStr;
}
function getFormDataSize(formData) {
  let totalSize = 0;

  for (let pair of formData.entries()) {
      const [key, value] = pair;
      // Add size of key
      totalSize += new Blob([key]).size;

      if (value instanceof Blob) {
          // For files, add their size directly
          totalSize += value.size;
      } else {
          // For text fields, add the size of the value
          totalSize += new Blob([value]).size;
      }
  }

  return totalSize;
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function showSnackbar(text) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = text;
  snackbar.className = "snackbar show";
  setTimeout(function() {
      snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
// Function to handle events and log the event type
function handleEvent(event) {
 //showSnackbar(addNetworkEventListener_count + ' Event type:', event.type);
 refresh_dashboard = false;

 addNetworkEventListener_count = 1;
}
function displayPdf(ReportFileURL,pdfContainer) {
  // Clear any existing content in the pdfContainer
  pdfContainer.innerHTML = '';
  const loadingDiv = document.createElement('div');  
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border'; // Add the spinner class
  spinner.setAttribute('role', 'status');
  
  // Create the span element for the "Loading..." text
  const visuallyHiddenText = document.createElement('span');
  visuallyHiddenText.className = 'visually-hidden'; // Add the class for screen readers
  visuallyHiddenText.innerText = 'Loading...';
  
  // Append the span to the spinner
  spinner.appendChild(visuallyHiddenText);
  
  // Append the spinner to the loading div
  loadingDiv.appendChild(spinner);
  
  // Append the loading div to the container
  pdfContainer.appendChild(loadingDiv);

  // Fetch and display the PDF
  pdfjsLib.getDocument(ReportFileURL).promise.then(function(pdfDoc) {
      pdfContainer.removeChild(loadingDiv);

      function renderPage(pageNumber) {
          pdfDoc.getPage(pageNumber).then(function(page) {
              const containerWidth = pdfContainer.clientWidth;
              const viewportscale = page.getViewport({ scale: 1 });
              const scale = containerWidth / viewportscale.width;
              const viewport = page.getViewport({ scale });

              // Create canvas and render the page
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              context.imageSmoothingEnabled = true;
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              pdfContainer.appendChild(canvas);

              page.render({
                  canvasContext: context,
                  viewport: viewport,
              });
          });
      }

      // Render all pages
      for (let i = 1; i <= pdfDoc.numPages; i++) {
          renderPage(i);
      }

  }).catch(function(error) {
      pdfContainer.removeChild(loadingDiv);
      $('.view_inspection_report_err').html('Error loading PDF: ' + JSON.stringify(error));
  });
  
}
// Select the element to attach the event listeners
const targetElement = document.querySelector('body');
// Attach event listeners for different event types
const eventTypes = ['click', 'keydown', 'focus', 'blur', 'scroll'];
eventTypes.forEach(eventType => {
  targetElement.addEventListener(eventType, handleEvent);
});
function changeStyles(backgroundColor, textColor, borderColor) {
  // Change background color of body
  document.body.style.backgroundColor = backgroundColor;

  // Change text color of all text elements
  document.querySelectorAll('*').forEach(function(element) {
    element.style.color = textColor;
  });

  // Change border color of all elements with borders
  document.querySelectorAll('*').forEach(function(element) {
    if (window.getComputedStyle(element).borderStyle !== 'none') {
      element.style.borderColor = borderColor;
    }
  });

  // Optionally, update specific elements like buttons, inputs, etc.
  document.querySelectorAll('button, input, textarea, .card-header, .list-group-item').forEach(function(element) {
    element.style.backgroundColor = backgroundColor;
    element.style.color = textColor;
    element.style.borderColor = borderColor;
  });
}
function drawSignatureCanvas() {
  const canvas = document.getElementById('signatureCanvas');
  const ctx = canvas.getContext('2d');
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn = document.getElementById('saveBtn');
  var userAction = "oldSignature";

  let drawing = false;

  // Function to apply gradient background
  /**function applyGradientBackground() {
    // Create a linear gradient (adjust the coordinates to suit the direction)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);  // Horizontal gradient
    gradient.addColorStop(0, localStorage.getItem('themeColor'));  // Start color
    gradient.addColorStop(1, '#c5c7f1');  // End color

    // Apply gradient to the canvas background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } */

  // Function to apply a semi-transparent gradient background
  function applyGradientBackground() {
    // Create a linear gradient (adjust the coordinates to suit the direction)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);  // Horizontal gradient
    let themeColor = '#f0f0f0';//localStorage.getItem('themeColor');
    
    // Check if the color is stored properly and is in valid hex format
    if (themeColor && themeColor.length === 7 && themeColor.startsWith('#')) {
        // Add semi-transparent colors (using hexadecimal color)
        gradient.addColorStop(0, themeColor + 'E6');  // Start color with 90% transparency (E6 in hex)
    }
    gradient.addColorStop(1, '#f0f0f0');  // End color #c5c7f1 with 90% transparency (E6 in hex)
    

    // Apply gradient to the canvas background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }


  // Set canvas dimensions dynamically and apply background
  function setCanvasDimensions() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // Redraw background after resizing
    //ctx.fillStyle = "#f0f0f0";  // Light background color
    applyGradientBackground();

    //ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Call this function to ensure the canvas dimensions are correct on page load
  setCanvasDimensions();

  // Set background color to light
  ctx.fillStyle = "#f0f0f0"; // Light background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set stroke style for the signature
  ctx.strokeStyle = "#000000"; // Black color for the signature
  ctx.lineWidth = 2; // You can adjust the line width as needed

  // Get mouse position relative to the canvas
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Get touch position relative to the canvas
  function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }

  // Start drawing
  function startDrawing(x, y) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  // Draw on the canvas
  function draw(x, y) {
    if (!drawing) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Stop drawing
  function stopDrawing() {
    drawing = false;
    userAction = "newSignature";
    document.querySelector(".signature-button-group").classList.remove("d-none");
  }

  // Mouse Events
  canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getMousePos(e);
    startDrawing(x, y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const { x, y } = getMousePos(e);
    draw(x, y);
  });

  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Touch Events
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling on mobile
    const { x, y } = getTouchPos(e);
    startDrawing(x, y);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling on mobile
    const { x, y } = getTouchPos(e);
    draw(x, y);
  });

  canvas.addEventListener('touchend', stopDrawing);

  // Clear the canvas
  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reset the background
    ctx.fillStyle = "#f0f0f0"; // Light background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Save the signature
  saveBtn.addEventListener('click', async () => {
    const saveButton = saveBtn;  // Store reference to the save button

    const dataURL = canvas.toDataURL("image/jpeg");  // Specify format as JPEG
    const imgElement = document.createElement('img');
    imgElement.src = dataURL;

    // Clear previous content in the toast body (if needed)
    $(".toast-body").empty();
    $(".toast-body").append(imgElement);
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    //toastBootstrap.show();
    //document.querySelector(".toast-container").classList.remove("d-none");

    const formData = new FormData();
    var selectedCompanyID = localStorage.getItem('userCompanyID');

    // Find the selected company in the companies array
    var selectedCompany = companies.find(function(company) {
      return company.CompanyID == selectedCompanyID;
    });

    var CompanyName = "";
    if (selectedCompany) {
      CompanyName = selectedCompany.CompanyName;
    }

    // Generate the file name
    let fileName = CompanyName + '_' + localStorage.getItem('userRole') + '_Signature';
    fileName = fileName.replace(/\s+/g, '_').toLowerCase() + ".jpg";

    // Create a JSON object with the base64 data
    const metadata = {
      imageData: dataURL.split(',')[1]  // Only take the base64 part
    };

    // Convert to a JSON string and create a Blob
    const jsonString = JSON.stringify(metadata);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    formData.append('signature[]', jsonBlob, fileName);
    formData.append('deviceID', localStorage.getItem('deviceID'));
    formData.append('userCompanyID', localStorage.getItem('userCompanyID'));
    formData.append('userRole', localStorage.getItem('userRole'));
    formData.append('action', userAction);

    const appendIfExists = (elementId, formDataKey) => {
      const element = document.getElementById(elementId);
      if (element) {
        formData.append(formDataKey, element.value);
      }
    };

    appendIfExists('additionalHeaderInfo', 'additionalHeaderInfo');
    appendIfExists('additionalBodyInfo', 'additionalBodyInfo');
    appendIfExists('additionalFooterInfo', 'additionalFooterInfo');
    appendIfExists('additionalNotationInfo', 'additionalNotationInfo');

    // Display loading spinner
    $(saveButton).html('<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>');

    try {
      await savePdfSettings(formData);
      $(saveButton).html('Save');
      userAction = "oldSignature";
    } catch (error) {
      showSnackbar('An error occurred while saving the PDF settings. Please try again.');
      $(saveButton).html('Save');
    }
  });

  const settingsBtn = document.getElementById('valuer-settings-tab');
  settingsBtn.addEventListener('click', () => {
    setTimeout(() => {
      setCanvasDimensions();
    }, 500);
  });

  // Set canvas dimensions on load and resize
  window.addEventListener('resize', setCanvasDimensions);
}
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Ensure that the textarea is not visible
  textarea.style.position = "fixed";
  textarea.style.opacity = 0;

  // Append the textarea to the document
  document.body.appendChild(textarea);

  // Select the text content in the textarea
  textarea.select();

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the textarea from the document
  document.body.removeChild(textarea);

  // Optional: Provide feedback to the user
  showSnackbar("Link copied to clipboard.");
}
function updateWatermarkImage(newImagePath) {
  const cardBodies = document.querySelectorAll('.a4-card .card-body');
  
  cardBodies.forEach(cardBody => {
    cardBody.style.setProperty('--watermark-image', `url('${newImagePath}')`);
  });
}
// Function to change background-color dynamically
function changeBackgroundColor(newvColor) {
  var newColor = '#32062e';
  newColor = newvColor;

  // Helper function to convert HEX to HSL
  function hexToHsl(hex) {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
          h = s = 0; // achromatic
      } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h * 360, s * 100, l * 100];
  }

  // Helper function to convert HSL back to HEX
  function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;

      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;

      let r, g, b;
      if (h < 60) {
          [r, g, b] = [c, x, 0];
      } else if (h < 120) {
          [r, g, b] = [x, c, 0];
      } else if (h < 180) {
          [r, g, b] = [0, c, x];
      } else if (h < 240) {
          [r, g, b] = [0, x, c];
      } else if (h < 300) {
          [r, g, b] = [x, 0, c];
      } else {
          [r, g, b] = [c, 0, x];
      }

      return `#${Math.round((r + m) * 255).toString(16).padStart(2, '0')}${Math.round((g + m) * 255).toString(16).padStart(2, '0')}${Math.round((b + m) * 255).toString(16).padStart(2, '0')}`;
  }

  // Function to dynamically change colors
  const elementsWithColors = {
      '#32062e': ['.btn-get-started', '.spinner-grow', '.bg_color', '.btn-with-spinner', 
                  '.btn-outline-secondary', '.btn-bd-primary', '.bt_bg_color', 
                  '.gm_btn', '.theme-btn', '.dropdown-menu', 'button', '.list-group-item', 
                  '.bg-valuationPro', '.a4-card .card-header','.progress-bar'],
      'border-color': ['.btn-outline-secondary', '.btn-bd-primary', '.theme-btn', '.form-check-input'],
      'text-color': ['a', '.remember-me', '.dropdown-item', '.text-size-h6', '.report-p-text', '.report-table-td'],
      'hover': ['.btn-get-started:hover', '.dropdown-item:hover', '.bt_bg_color:hover', '.btn-bd-primary:hover'],
  };

  // Update the background, border, and text colors for elements using #32062e
  elementsWithColors['#32062e'].forEach(function(selector) {
      document.querySelectorAll(selector).forEach(function(element) {
          // Special handling for the .a4-card .card-header to modify gradient
          if (selector === '.a4-card .card-header') {
              element.style.background = `linear-gradient(to right, ${newColor}, #c5c7f1)`;
          } else {
              element.style.backgroundColor = newColor;
          }
      });
  });

  // Update border colors using #32062e
  elementsWithColors['border-color'].forEach(function(selector) {
      document.querySelectorAll(selector).forEach(function(element) {
          element.style.borderColor = newColor;
      });
  });

  // Update text colors using #32062e
  elementsWithColors['text-color'].forEach(function(selector) {
      document.querySelectorAll(selector).forEach(function(element) {
          element.style.color = newColor;
      });
      document.querySelectorAll('.download-button').forEach(button => {
        button.style.color = 'white';
      });    
  });

  // Apply hover adjustments
  elementsWithColors['hover'].forEach(function(selector) {
      document.querySelectorAll(selector).forEach(function(element) {
          element.addEventListener('mouseenter', function() {
              element.style.backgroundColor = newColor;
          });
          element.addEventListener('mouseleave', function() {
              element.style.backgroundColor = '#32062e';  // Reset to original color on mouse leave
          });
      });
      document.querySelectorAll('.download-button').forEach(button => {
        button.style.color = 'inherit';
      });
    
  });
}
function updateProgressBar(fileSizeMB) {
  const maxSizeMB = 1000; // Maximum file size in MB
  const percentage = Math.min((fileSizeMB / maxSizeMB) * 100, 100); // Calculate percentage, cap at 100%
  const progressBar = document.getElementById('progressBar');

  // Set width and label
  progressBar.style.width = `${percentage}%`;
  progressBar.textContent = `${Math.round(percentage)}%`;

  // Update class based on percentage
  progressBar.classList.remove('text-bg-success', 'text-bg-info', 'text-bg-warning', 'text-bg-danger');

  if (percentage <= 25) {
      progressBar.classList.add('text-bg-success');
  } else if (percentage <= 50) {
      progressBar.classList.add('text-bg-info');
  } else if (percentage <= 75) {
      progressBar.classList.add('text-bg-warning');
  } else {
      progressBar.classList.add('text-bg-danger');
  }
}
function isVideoFile(filePath) {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.mpeg'];
  const ext = filePath.split('.').pop().toLowerCase();
  return videoExtensions.includes(`.${ext}`);
}


function onValuatorDeviceReady() {
  const yearOfManfInput = document.getElementById("yearOfManfValuatorInput");
  const makeInput = document.getElementById("makeValuatorInput");
  const modelInput = document.getElementById("modelValuatorInput");
  const modelTypeInput = document.getElementById("modelTypeValuatorInput");
  const makeSuggestions = document.getElementById("vehicleMakeValuatorSuggestions");
  const modelSuggestions = document.getElementById("vehicleModelValuatorSuggestions");
  const modelTypeSuggestions = document.getElementById("vehicleModelTypeValuatorSuggestions");

  $.ajax({
      url: urlValuator + "/api/getCarData.php",
      method: 'GET',
      dataType: 'json',
      success: function(response) {
          if (response.status === 'success') {
              carRData = response.data.carData;
              timestamp = response.timestamp;

              let featuredAuctions = '';
              
              auctions = response.data.auctions;
              imagesAuctions = response.data.imagesAuctions;
              var vehicleImagePath = '';
              var poster = '';

              auctions.forEach(auction => {

                imagesAuctions.forEach(image => {
                  if (auction.VehicleID == image.VehicleID) {
                    if (image.Description == "Right front") {
                      poster = image.ImagePath;
                    }
        
                    if (image.Description == "Right front") {
                      vehicleImagePath = ` 
                        <img src="${image.ImagePath}" alt="${image.Description}" class="vehicle-image img-fluid" VehicleID="${auction.VehicleID}">
                      `;
                    } else if (isVideoFile(image.ImagePath)) {
                      vehicleImagePath = ` 
                        <video src="${image.ImagePath}" poster="${poster}" class="vehicle-image img-fluid request_video_${image.VehicleID}" VehicleID="${auction.VehicleID}" style="object-fit: cover;" playsinline></video>
                      `;
                      
                      setTimeout(() => {
                        // Get all video elements matching the class
                        const videos = document.getElementsByClassName(`request_video_${image.VehicleID}`);
                    
                        if (videos.length > 0) {
                            Array.from(videos).forEach((video) => {
                                // Play on hover
                                video.addEventListener("mouseenter", () => {
                                    video.play();
                                });
                    
                                // Pause when mouse leaves
                                video.addEventListener("mouseleave", () => {
                                    video.pause();
                                });
                    
                                // Toggle play/pause on click
                                video.addEventListener("click", () => {
                                    if (video.paused) {
                                        video.play();
                                    } else {
                                        video.pause();
                                    }
                                });
                    
                                // Ensure video restarts when it ends
                                video.addEventListener("ended", () => {
                                    video.currentTime = 0;
                                });
                            });
                        }
                      }, 100);
                  
                    }
                  }
                });
                const endTime = new Date(auction.EndTime.replace(' ', 'T')).getTime();
                const currentTime = new Date(timestamp.replace(' ', 'T')).getTime();
                const timeLeft = endTime - currentTime;

                const timeLeftWords = convertMillisecondsToWords(timeLeft);

                if (timeLeftWords !="Auction Ended") {
                  featuredAuctions += `
                  <div class="col-md-4 mb-4">
                    <div class="card bg-dark text-light">
                      ${vehicleImagePath}
                      <div class="card-body card-body-fixed">
                        <h5 class="card-title">🚗 <b>${auction.Year} ${auction.Make} ${auction.Model} ${auction.ModelType}</b></h5>
                        <p class="card-text">Starting Bid: ${addCommasToNumber(auction.ForcedValue)}</p>
                        <p class="card-text mb-3">Time Left: <span class="badge bg-warning">${timeLeftWords}</span></p>
                        <a href="#" class="btn btn-primary view-auction-btn" data-vehicleid="${auction.VehicleID}" timeLeft="${timeLeftWords}" data-startingbid="${addCommasToNumber(auction.ForcedValue)}" data-title="${auction.Year} ${auction.Make} ${auction.Model} ${auction.ModelType}">View Auction</a>
                      </div>
                    </div>
                  </div>`;                  
                }            

              });
              
              $("#featured-auctions").html(featuredAuctions);              
              
              $("#downloadApplicationBtn").html(`${response.donwloadUrl}`);

              setupAutocomplete();
          } else {
              showSnackbar(`Error: ${response.message}`);
          }
      },
      error: function(xhr, status, error) {
          showSnackbar(`AJAX Error: ${status} - ${error}`);
      }
  });
  
  function convertMillisecondsToWords(ms) {
    if (ms <= 0) return "Auction Ended";
  
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
  
    return result || "Less than 1m";
  }  

  function setupAutocomplete() {
      // Car Make Input Autocomplete
      makeInput.addEventListener('input', function () {
          if (this.disabled) return;
          const query = this.value.toLowerCase();
          makeSuggestions.innerHTML = '';
          modelInput.value = '';
          modelTypeInput.value = '';
          modelInput.disabled = true;
          modelTypeInput.disabled = true;

          if (query) {
              const filteredMakes = carRData.filter(make =>
                  make.make.toLowerCase().includes(query)
              );
              filteredMakes.forEach(make => {
                  const div = document.createElement('div');
                  div.textContent = make.make;
                  div.addEventListener('click', () => {
                      makeInput.value = make.make;
                      makeSuggestions.style.display = 'none';
                      modelInput.disabled = false;
                      modelInput.focus();
                  });
                  makeSuggestions.appendChild(div);
              });
              makeSuggestions.style.display = filteredMakes.length ? 'block' : 'none';
          } else {
              makeSuggestions.style.display = 'none';
          }
      });

      // Car Model Input Autocomplete
      modelInput.addEventListener('input', function () {
          if (this.disabled) return;
          const query = this.value.toLowerCase();
          modelSuggestions.innerHTML = '';
          modelTypeInput.value = '';
          modelTypeInput.disabled = true;

          const selectedMake = carRData.find(make => make.make === makeInput.value);
          if (selectedMake && query) {
              const filteredModels = selectedMake.models.filter(model =>
                  model.name.toLowerCase().includes(query)
              );
              filteredModels.forEach(model => {
                  const div = document.createElement('div');
                  div.textContent = model.name;
                  div.addEventListener('click', () => {
                      modelInput.value = model.name;
                      modelSuggestions.style.display = 'none';
                      modelTypeInput.disabled = false;
                      modelTypeInput.focus();
                      submitValuation();

                  });
                  modelSuggestions.appendChild(div);
              });
              modelSuggestions.style.display = filteredModels.length ? 'block' : 'none';
          } else {
              modelSuggestions.style.display = 'none';
              submitValuation();
          }
      });

      // Car Model Type Input Autocomplete
      modelTypeInput.addEventListener('input', function () {
          if (this.disabled) return;
          const query = this.value.toLowerCase();
          modelTypeSuggestions.innerHTML = '';

          const selectedMake = carRData.find(make => make.make === makeInput.value);
          if (selectedMake) {
              const selectedModel = selectedMake.models.find(model => model.name === modelInput.value);
              if (selectedModel && query) {
                  const filteredTypes = Array.isArray(selectedModel.type) 
                      ? selectedModel.type.filter(type => type.toLowerCase().includes(query)) 
                      : [];
                  filteredTypes.forEach(type => {
                      const div = document.createElement('div');
                      div.textContent = type;
                      div.addEventListener('click', () => {
                          modelTypeInput.value = type;
                          modelTypeSuggestions.style.display = 'none';
                          submitValuation();
                      });
                      modelTypeSuggestions.appendChild(div);
                  });
                  modelTypeSuggestions.style.display = filteredTypes.length ? 'block' : 'none';
              } else {
                  modelTypeSuggestions.style.display = 'none';
                  submitValuation();
              }
          }
      });

      // Hide suggestions when clicking outside
      document.addEventListener('click', (e) => {
          if (!makeInput.contains(e.target)) makeSuggestions.style.display = 'none';
          if (!modelInput.contains(e.target)) modelSuggestions.style.display = 'none';
          if (!modelTypeInput.contains(e.target)) modelTypeSuggestions.style.display = 'none';
      });
  }

  // Submit valuation when all fields are filled
  function submitValuation() {
      const yearOfManf = yearOfManfInput.value;
      const selectedMake = makeInput.value;
      const selectedModel = modelInput.value;
      const selectedModelType = modelTypeInput.value;

      if (!selectedMake || !selectedModel) {
          showSnackbar("Please fill in Make or Model fields.");
          return;
      }

      $("#responseValuator").html(`
          <div class="d-flex justify-content-center">
              <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          </div>
      `);

      localStorage.setItem('vehicleValuatorData', JSON.stringify({
          yearOfManf, make: selectedMake, model: selectedModel, modelType: selectedModelType, url: urlValuator
      }));

      if (typeof updateMLModel === 'function') {
          updateMLModel(urlValuator);
      } else {
          showSnackbar("updateMLModel function is missing!");
      }
  }

  // Trigger submission on Enter key in modelTypeInput
  modelTypeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitValuation();
  });
}

function updateMLModel(urlValuator) {

  fetchMLModel(localStorage.getItem('vehicleValuatorData'), urlValuator);
  
  retryCount++;
  setTimeout(() => {
    updateMLModel(urlValuator);
  }, 15000);
}

function fetchMLModel(data, urlValuator) {

  $.ajax({
      url: urlValuator + "/api/valuator.php",
      type: "POST",
      data: data,
      contentType: "application/json",
      success: function (response) {

          if (response.message) {
              $("#responseValuator").text(response.message);
          } else if (response.valuationResult && response.valuationResult.length > 0) {
              let displayHtml = "<h3>Vehicle Valuations:</h3>";

              /**response.vehicles.forEach(vehicle => {
                displayHtml += `
                    <b>🚗 Vehicle ID: ${vehicle.vehicle_id} ${vehicle.yearOfManf} ${vehicle.make} ${vehicle.model} ${vehicle.modelType}</b><br>
                    <p style="color: #4CAF50;">
                        <b>- Market Value:</b> ${vehicle.marketValue}<br> 
                        <b>- Forced Value:</b> ${vehicle.forcedValue}<br>
                        <b>- Rule Explanation:</b> ${vehicle.rule_explanation}<br> 
                        <b>📊 Rule Based Value:</b> ${vehicle.rule_based_value}<br> 
                        <b>🧠 ML Value:</b> ${vehicle.ml_value}<br> 
                        <b>- Suggested Value:</b> ${vehicle.suggested_value}<br>
                        <b>- Status:</b> ${vehicle.status}<br> 
                        <b>💰 Final Value:</b> ${vehicle.final_value}<br>
                        ${vehicle.serverMessage}<br>
                    </p>`;
              }); */
            
              // Append valuation results to the vehicle list
              response.valuationResult.forEach(valuation => {
                displayHtml += `
                <div class="accordion mt-3" id="valuationAccordion${valuation.vehicle_ID}">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse${valuation.vehicle_ID}" aria-expanded="false">
                                
                                <!-- Vehicle Details -->
                                <div style="flex: 2;">
                                    🚗 <b>${valuation.yearOfManf} ${valuation.make} ${valuation.model} ${valuation.modelType}</b> (${valuation.vehicle_ID})
                                </div>
            
                                <!-- Valuation Data -->
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: flex-end;">
                                    <span class="badge bg-secondary">Market: ${valuation.marketValue}</span>
                                    <span class="badge bg-secondary">Forced: ${valuation.forcedValue}</span>
                                    <span class="badge bg-success">📊 Rule-Based: ${valuation.value}</span>
                                    <span class="badge bg-primary">🧠 ML: ${valuation.ml_prediction}</span>
                                    <span class="badge bg-warning text-dark">💰 Suggested: ${valuation.suggested_value}</span>
            
                                    <!-- ML Confidence Badge -->
                                    <span class="badge text-white" style="background: ${valuation.explainability.ML.delta === 0 ? '#F44336' : '#4CAF50'};">
                                        <b>ML Confidence:</b> ${valuation.explainability.ML.delta === 0 ? 'Low' : 'High'}
                                    </span>
                                </div>
                            </button>
                        </h2>
            
                        <!-- Accordion Content -->
                        <div id="collapse${valuation.vehicle_ID}" class="accordion-collapse collapse" data-bs-parent="#valuationAccordion${valuation.vehicle_ID}">
                            <div class="accordion-body">
                                <div class="d-flex flex-wrap gap-3">
                                    
                                    <!-- Adjustments -->
                                    <div style="flex: 1; min-width: 180px;">
                                        <b class="text-dark">⚙️ Adjustments</b>
                                        <ul class="p-2 bg-dark text-light border rounded list-unstyled mt-2">
                                            ${valuation.adjustments.map(adj => `<li>✅ ${adj}</li>`).join('')}
                                        </ul>
                                    </div>
            
                                    <!-- Market Trends -->
                                    <div style="flex: 1; min-width: 180px;">
                                        <b class="text-dark">📈 Market Trends</b>
                                        <ul class="p-2 bg-warning bg-opacity-25 border rounded list-unstyled mt-2">
                                            ${valuation.trends.map(trend => `<li>📊 ${trend}</li>`).join('')}
                                        </ul>
                                    </div>
            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;            
            
              });
              $("#responseValuator").html(displayHtml);

          } else if (response.errors && response.errors.length > 0) {
              let errorHtml = "<h3>Errors:</h3><ul>";
              response.errors.forEach(error => {
                  errorHtml += `<li>${error}</li>`;
              });
              errorHtml += "</ul>";
              $("#responseValuator").html(errorHtml);
          } else if (response.error) {
              $("#responseValuator").text("Error: " + response.error);
          } else {
              $("#responseValuator").text("Data processed successfully.");
          }
      },
      error: function (xhr, status, error) {
          $("#responseValuator").html(
              `<div style="color: red;">
                  <b>Error processing request:</b> ${xhr.status} ${xhr.statusText}<br>
                  <b>Details:</b> ${xhr.responseText}
              </div>`
          );
      }
  });
}