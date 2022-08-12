import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Script from "next/script";
import { useSetRecoilState } from "recoil";
import { isLoading_ } from "../../lib/recoil";
import { getAwsUrl } from "../../lib/utility";
import React from "react";

export default function Editor({ onChange, value }) {
  let editor;
  const setLoading = useSetRecoilState(isLoading_);

  class MyUploadAdapter {
    constructor(loader) {
      // The file loader instance to use during the upload.
      this.loader = loader;
    }

    // Starts the upload process.
    upload() {
      return this.loader.file.then(async (file) => {
        const awsUrl = await getAwsUrl(file);
        return new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file, awsUrl);
        });
      });
    }

    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());

      // Note that your request may look different. It is up to you and your editor
      // integration to choose the right communication channel. This example uses
      // a POST request with JSON as a data structure but your configuration
      // could be different.
      xhr.open("POST", "/api/uploadimage", true);
      xhr.responseType = "json";
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;

      // @ts-ignore
      xhr.addEventListener("error", () => reject(genericErrorText));
      // @ts-ignore
      xhr.addEventListener("abort", () => reject());
      // @ts-ignore
      xhr.addEventListener("load", () => {
        // @ts-ignore
        const response = xhr.response;

        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText
          );
        }

        // If the upload is successful, resolve the upload promise with an object containing
        // at least the "default" URL, pointing to the image on the server.
        // This URL will be used to display the image in the content. Learn more in the
        // UploadAdapter#upload documentation.
        resolve({
          default: response.url,
        });
      });

      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      // @ts-ignore
      if (xhr.upload) {
        // @ts-ignore
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // Prepares the data and sends the request.
    _sendRequest(file, awsUrl) {
      // Prepare the form data.
      const data = new FormData();

      data.append("upload", file);

      // Important note: This is the right place to implement security mechanisms
      // like authentication and CSRF protection. For instance, you can use
      // XMLHttpRequest.setRequestHeader() to set the request headers containing
      // the CSRF token generated earlier by your application.

      // Send the request.
      // @ts-ignore
      this.xhr.send(awsUrl);
    }
  }

  function MyCustomUploadAdapterPlugin(editor) {
    console.log("editor", editor);
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      console.log("loader", loader);
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader);
    };
  }

  // const mydata = `<p>asdfd</p><blockquote><p>dfdffgffggfg</p></blockquote><figure class="image"><img src="https://ngav21e78a8b3cc4f543578f719d56dc031e1c170205-dev.s3.eu-west-2.amazonaws.com/public/WhatsApp+Image+2021-07-30+at+11.54.17+AM.jpeg"></figure><p>&nbsp;</p>`;

  return (
    <Stack>
      <Stack>
        <Box id="editor"></Box>
        <Script
          src="https://cdn.ckeditor.com/ckeditor5/34.0.0/classic/ckeditor.js"
          strategy="lazyOnload"
          onLoad={() => {
            // @ts-ignore
            ClassicEditor.create(document.querySelector("#editor"), {
              //  toolbar:[],
              extraPlugins: [MyCustomUploadAdapterPlugin],
              initialData: myData,
            })
              .then((newEditor) => {
                editor = newEditor;
                newEditor.model.document.on("change", () => {
                  console.log("The Document has changed!");
                  onChange(editor.getData());
                });
              })
              .catch((error) => {
                console.error(error);
              })
              .finally(() => {
                console.log("done and style");
              });

            // Assuming there is a <button id="submit">Submit</button> in your application.
            // document
            //   .querySelector("#submit")
            //   .addEventListener("click", onSubmit);
          }}
        />
      </Stack>
    </Stack>
  );
}

const myData = `<p>Do you want to study in Iceland? Read on to find everything you need to know about how to study, work and live in Iceland. Iceland is a small island country off the coast of Europe. It&#8217;s known for its ice volcanoes and stunning scenery. The country is captivating to tourists and international students alike. Studying in Iceland is suitable for fields in natural sciences. If you intend to pursue a program in this discipline or any other, this article will guide you.<br />\nIceland is a small country, which practically all of the activities take place in Reykjavik, the capital. International students who want to visit one of the world&#8217;s most beautiful natural wonders should consider studying in Iceland. Iceland has a small number of universities, but those that are there are regarded as some of the greatest in the world, particularly in the sciences.</p>\n<p>The country has seven universities. The majority of higher education institutions are managed by the government or by private organizations with government funding. There are over 20,000 students enrolled in Iceland’s higher education, with about 5% of them being international students.</p>\n<p>Iceland, despite its small size, is one of the calmest countries to live in. International students who want to study in Iceland will surely find the country very interesting. Check below for some amazing reasons why you should consider Iceland.</p>\n<h2>Why study in Iceland?</h2>\n<p><a href=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg\"><img loading=\"lazy\" class=\"aligncenter size-full wp-image-24590\" src=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg\" alt=\"How to study, work and live in Iceland\" width=\"640\" height=\"427\" srcset=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg 640w, https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash-300x200.jpg 300w\" sizes=\"(max-width: 640px) 100vw, 640px\" /></a></p>\n<p>&nbsp;</p>\n<p>• Iceland is decent for international students<br />\nIceland has seven highly competent international academic programs in a variety of subjects, providing excellent options for higher education. Applications from eligible students from all around the world are welcome in Icelandic higher education institutions.<br />\n• Study in a science city<br />\nIceland’s tertiary education offers a progressive education and innovative programs. They are known to be research-based.<br />\n• Standard living/quality life<br />\nIceland consistently ranks as one of the top countries offering a quality life. It has one of the greatest literacy rates in the world, a fantastic record of equality, and can be regarded as one of the world&#8217;s most peaceful countries in the world.</p>\n<h2>How to apply for admission in Iceland</h2>\n<p><a href=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg\"><img loading=\"lazy\" class=\"aligncenter size-full wp-image-24590\" src=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg\" alt=\"How to study, work and live in Iceland\" width=\"640\" height=\"427\" srcset=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash.jpg 640w, https://cdn.naijagoingabroad.com/wp-content/uploads/20211008082655/ferdinand-stohr-7F3jUAyqTBg-unsplash-300x200.jpg 300w\" sizes=\"(max-width: 640px) 100vw, 640px\" /></a></p>\n<p>&nbsp;</p>\n<p>1. Find a program<br />\nFinding a program and university in Iceland is not difficult because they are not many universities there which could have made your selection difficult. So, choose a university of your choice, type in the search box to see the lists of programs offered in the university.<br />\n2. Check the lists of documents to submit<br />\nDid you find your course on the school website? If yes, the next step is to check for the admission requirements and assemble them to begin the application process. Listed below are the entry requirements for study in Iceland<br />\nAdmission requirements for Iceland<br />\nOnline application form<br />\nCV (for postgraduate or doctoral studies)<br />\nLetter of motivation<br />\nGrade transcripts from your previous education (electronically and a posted hard copy)<br />\nTwo letters of recommendation<br />\nEnglish language proficiency test<br />\nPassport<br />\nPassport photographs<br />\nApplication fee<br />\n3. Submit your application<br />\nThere is no unified application portal in Iceland. Applications are sent to specific schools which requires downloading and filling the application form. The application form is usually printed and mailed after being downloaded from the institution&#8217;s website. Also, students can request that the application form be sent to their home address through your institution&#8217;s foreign relations office.<br />\nBefore you submit your application, you are expected to pay an application fee. The application fee is around 7,400ISK and should be paid directly to the school.<br />\n4. Get your acceptance letter<br />\nThe school will send you an acceptance letter once a decision has been made, and you will use it when applying for your visa.<br />\n5. Apply for a study visa<br />\nDepending on your nationality, you may need a study visa to enter Iceland. Generally, to apply for the study visa, you will provide the following documents:<br />\nVisa requirements for Iceland<br />\nA completed application form<br />\nPassport Identity<br />\nTwo passport-sized photos<br />\nProof of fee payment<br />\nCopy of acceptance letter from your university<br />\nProof of no criminal record<br />\nProof of health insurance<br />\nProof of financial self-sufficiency through bank statements</p>\n<h2>Intake period</h2>\n<p><a href=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210726092535/estee-janssens-zni0zgb3bkQ-unsplash-1.jpg\"><img loading=\"lazy\" class=\"aligncenter size-full wp-image-24408\" src=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210726092535/estee-janssens-zni0zgb3bkQ-unsplash-1.jpg\" alt=\"How to study, work and live in Iceland\" width=\"640\" height=\"428\" srcset=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210726092535/estee-janssens-zni0zgb3bkQ-unsplash-1.jpg 640w, https://cdn.naijagoingabroad.com/wp-content/uploads/20210726092535/estee-janssens-zni0zgb3bkQ-unsplash-1-300x201.jpg 300w\" sizes=\"(max-width: 640px) 100vw, 640px\" /></a></p>\n<p>&nbsp;</p>\n<p>Iceland&#8217;s academic year is split into two semesters, autumn and spring, and lasts from September to May. The autumn semester goes from September 1 to December 31, while the spring semester runs from January 1 to May 31. Specific fields may vary.<br />\nEvery institution has its own application deadlines, but you should apply in December or January of the year before you want to start.<br />\nApplication deadlines for most universities in Iceland<br />\nInternational students<br />\n1 February each year<br />\n15 April / 5 June each year (Nordic citizens, graduate/undergraduate studies and some graduate diploma).<br />\nExchange students<br />\nAutumn semester or full academic year:<br />\n1 April each year<br />\n1 May each year for EEA citizens<br />\nWhere to study: Universities in Iceland<br />\nAgricultural University of Iceland<br />\nBifröst University<br />\nHólar University College<br />\nIceland University of the Arts<br />\nReykjavik University<br />\nUniversity of Akureyri<br />\nUniversity of Iceland</p>\n<h2>Are there scholarships for international students in Iceland?</h2>\n<p>Yes, international students can apply for scholarships through individual schools and through research councils.</p>\n<h2>Teaching language in Iceland</h2>\n<p>The majority of undergraduate courses in Icelandic universities are taught in Icelandic. However, a significant number of English-led master&#8217;s and Ph.D. programs are offered, mainly at the University of Iceland, Reykjavik University, and the University of Akureyri.</p>\n<h2>\nLanguage requirements for studies at universities in Iceland</h2>\n<p>In Iceland&#8217;s higher education institutions, Icelandic is the primary language of instruction. As a result, you will be asked to demonstrate your command of Icelandic. In general, you should be able to communicate in Icelandic at a level equivalent to B2 on the European Language Passport. International students can study in English-taught programs in some schools. See above to check the available English-taught programs in the listed schools.</p>\n<h2>Tuition Fees</h2>\n<p><a href=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210802082151/lilzidesigns-Qe9VT2CQnKg-unsplash.jpg\"><img loading=\"lazy\" class=\"aligncenter size-full wp-image-24441\" src=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210802082151/lilzidesigns-Qe9VT2CQnKg-unsplash.jpg\" alt=\"How to study, work and live in Iceland\" width=\"640\" height=\"427\" srcset=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210802082151/lilzidesigns-Qe9VT2CQnKg-unsplash.jpg 640w, https://cdn.naijagoingabroad.com/wp-content/uploads/20210802082151/lilzidesigns-Qe9VT2CQnKg-unsplash-300x200.jpg 300w\" sizes=\"(max-width: 640px) 100vw, 640px\" /></a></p>\n<p>&nbsp;</p>\n<p>Tuition fees at higher education institutions in Iceland vary by institution and program type. The amount charged depends on whether the university is state-owned or privately owned.<br />\nPublic institutions do not charge tuition for master&#8217;s degrees, however, all students must pay a €550 annual registration or administration fee.<br />\nIn Iceland, there are no tuition expenses for PhDs. Undergraduate students, on the other hand, will have to pay a tuition fee, which can range from €3000-€5000 each year. Fees are detailed on each school&#8217;s webpage.</p>\n<p>Tuition and registration expenses at private universities vary depending on the subject and institution. Students from outside the EU typically pay higher fees. Students should budget around ISK125, 540 per month for housing and other living expenditures, according to the University of Iceland.</p>\n<h2>\nCheap Universities in Iceland</h2>\n<p>University of Iceland<br />\nUniversity of Akureyri<br />\nAgricultural University of Iceland<br />\nIceland University of the Arts<br />\nBifröst University</p>\n<h2>Study and work in Iceland: Can international students work while studying?</h2>\n<p>Work permits are granted to international students studying in Iceland. A student may work up to 15 hours per week but a special work permit must be obtained for them to be permitted to use their study permit to work in Iceland.</p>\n<h2>Can international students stay back in Iceland after graduation?</h2>\n<p><a href=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210816103450/felipe-gregate-Ph2KD5qr7VQ-unsplash.jpg\"><img loading=\"lazy\" class=\"aligncenter size-full wp-image-24470\" src=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210816103450/felipe-gregate-Ph2KD5qr7VQ-unsplash.jpg\" alt=\"How to study, work and live in Iceland\" width=\"640\" height=\"426\" srcset=\"https://cdn.naijagoingabroad.com/wp-content/uploads/20210816103450/felipe-gregate-Ph2KD5qr7VQ-unsplash.jpg 640w, https://cdn.naijagoingabroad.com/wp-content/uploads/20210816103450/felipe-gregate-Ph2KD5qr7VQ-unsplash-300x200.jpg 300w\" sizes=\"(max-width: 640px) 100vw, 640px\" /></a></p>\n<p>&nbsp;</p>\n<p>International students&#8217; residence permits may be renewed for up to six (6) months after graduation to allow a graduate to look for work in his or her field of competence. After a minimum of two years of temporary residency, a student who has graduated from an Icelandic university is eligible for a permanent residence permit. For more information visit <a href=\"https://utl.is/index.php/en/residence-permits-for-students\">here</a></p>\n<h2>Conclusion</h2>\n<p>Iceland is a small country noble for its scientific prowess. The country can only boast of seven universities; which is why the population of international students studying in Iceland is below 5000. However, international students in Iceland find the country an exciting place.<br />\nStrong research-based programs are available in Iceland&#8217;s tertiary institutions. Natural sciences are one of the university&#8217;s strongest fields of study. There are various courses accessible at its universities, such as Arts, Business Management, Sciences, among others.</p>\n<p>International students enrolling for masters or doctoral degrees do not need to pay tuition fees, regardless of their nationality, and after completing your studies here, you are free to stay in the country for six months to search for a job.</p>\n`;
