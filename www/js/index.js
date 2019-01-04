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
var global = {
    photoURI: null
};
var app = {

    // Application Constructor
    initialize: function () {
        this.bindEvents();

    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.elements.photoBtn.addEventListener('click', this.takePicture, false);
        this.elements.recogBtn.addEventListener('click', this.recogPicture, false);
        this.elements.mailBtn.addEventListener('click', this.sendMail, false);
        this.elements.selectBtn.addEventListener('click', this.selectPicture, false);
        //this.elements.throbber.style.display = "none";
    },
    elements: {
        photoBtn: document.getElementById('take-picture'),
        selectBtn: document.getElementById('select-picture'),
        recogBtn: document.getElementById('recognize-text'),
        mailBtn: document.getElementById('send-mail'),
        targetImage: document.getElementById('target-image'),
        throbber: document.getElementById('throbber'),
        language: 'eng',

    },
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        console.log(TesseractPlugin);
        TesseractPlugin.loadLanguage('eng', function (response) {
            alert("Success lang data" + response);
        }, function (reason) {
            alert('Error on loading OCR file for your language. ' + reason);
        });
        document.getElementById('throbber').style.display = "none";
        document.getElementById('temp-status').style.display = "none";
        document.getElementById('temp-status2').style.display = "none";
        document.getElementById('target-image').style.display = "none";
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    takePicture: function () {
        navigator.camera.getPicture(function (picUri) {
            //document.getElementById('target-image').src = 'base64:card.jpg//'+picUri;
            //document.getElementById('target-image').style.display = "block";
            alert(picUri);
            console.log("Success Taking Image");
            var path = picUri.replace("file://", "");
            plugins.crop.promise(picUri, { quality: 100})
                .then(function success(newPath) {
                    window.plugins.Base64.encodeFile(newPath, function(base64){
                        console.log('file base64 encoding: ' + base64);
                        document.getElementById('temp-status').innerHTML = base64.replace("data:image/png;base64,", "");
                        alert(base64.replace("data:image/png;base64,", ""));
                    });
                })
                .catch(function fail(err) {
                    alert("cropping errored"+JSON.stringify(err));
                })
            console.log();
            alert("Image Loaded!");
        }, function (message) {
            console.log('Failed because: ' + message);
        }, {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true,
            //encodingType: Camera.EncodingType.JPEG,
            targetWidth: 350,
            targetHeight: 350,
            saveToPhotoAlbum: false,
            //allowEdit: true
            //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        });
    },
    selectPicture: function () {
        navigator.camera.getPicture(function (picUri) {
            console.log("Success Taking Image");
            document.getElementById('temp-status').innerHTML = picUri;
            console.log(picUri);
            alert("Image Loaded!");
        }, function (message) {
            console.log('Failed because: ' + message);
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation: true,
            //encodingType: Camera.EncodingType.JPEG,
            targetWidth: 350,
            targetHeight: 350,
            saveToPhotoAlbum: false,
            allowEdit: true,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        });
    },
    recogPicture: function () {
        //document.getElementById('throbber').style.display = "block";
        var photoURI = document.getElementById('temp-status').innerHTML;
        if (photoURI !== null) {
            try {
                TesseractPlugin.recognizeText(photoURI, 'eng', function (recognizedText) {
                    console.log(recognizedText);
                    alert(recognizedText);
                    if (recognizedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)) {
                        alert("Found EMAIL! \n" + recognizedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi));
                        document.getElementById('temp-status2').innerHTML = recognizedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                    } else {
                        alert("No Mail found");
                        document.getElementById('temp-status2').innerHTML = "TEMP";
                    }
                }, function (reason) {
                    console.log('Error on recognizing text from image. ' + reason);
                    alert('Failed reading image');
                });
            } catch (err) {
                console.err(err);
            }


        } else {
            //document.getElementById('temp-status').innerHTML = "Null exception";
            console.err("Null Exception");
        }
    },
    sendMail: function () {
        console.log("Mail OARTTTT!");
        if (document.getElementById('temp-status2').innerHTML != "TEMP") {
            alert("Found email!\n" + document.getElementById('temp-status2').innerHTML);
            cordova.plugins.email.open({
                to: document.getElementById('temp-status2').innerHTML,
                subject: 'thanks!!',
                attachments: ['base64:card.jpg//' + document.getElementById('temp-status').innerHTML]
            });
        } else {
            alert("No mail found :(");
        }
    }
};

app.initialize();