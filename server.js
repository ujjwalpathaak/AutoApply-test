import express, { response } from "express";
import bodyParser from "body-parser";
import cheerio from "cheerio";
import fs from "fs";
const app = express();

var PORT = process.env.PORT || 8080;

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

const getURLs = async (position, location) => {
  position = position.replace(" ", "-");
  let response =
    await fetch(`https://www.careerjet.co.in/${position}-jobs/${location}-84042.html?ay=1`, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,hi;q=0.8",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "s=0c9808fa062a2cc07f9c0e33d46824ce; u=ca88ba9cce85da553c76b76f5f839d64; _ga=GA1.1.291305013.1706009621; __gsas=ID=94fe62c43a26641e:T=1706009630:RT=1706009630:S=ALNI_MYAHcVV5W8Ir7a_B5Ax0MT-mFvcyA; g_state={\"i_p\":1706787301276,\"i_l\":3}; su19hd7=4b58882d694327ebc81704811feb49753b19f8e836d1e6db2c6a79998882a892603664545bf204cd3438a89e484e38c4a0005f511ebb84672472a2b817ad7e3b6e021952b8548b4180ee21aec40c2955a79975a2f76b3407144cc838b3e1bbc4098637681ea8c38d; as=0; o=0; mojolicious=eyJhZCI6eyJhcHBseV9rZXkiOiJmZDg3YmU3ZjczNDFmYTM3NzhjZTc2NDE2MjQ4ZmM4ZCIsImVtYWlsIjoiYTcyZDg3NGVlODczMzNkZTMzMTZmYmMzMTVkODNiMzA5NjNkOGMyMDhiMjBiNDA3ZWE3ZWI4NmMzOWMwNTEyZjRiNTUxODJhZDU4ZmQzZDEzMTUzNTI0NDVjMjI1MDBlM2JhYzE0NGRlYWY5ZWU5MmI2MGRlZTc4ZjQ3Mzc0Y2YwODY4NmM3MjQ5MTAxMzI4YzI0Mzg3ZGY5NGQxM2QyOCIsImhsIjoiZW5fSU4iLCJqb2JDb21wYW55TmFtZSI6IkpvYnMyR3JhYiIsImpvYkludGVybmFsUmVmIjoiaW40N2VjMzM2MGU2ZGUwM2I1M2U3MDBlNzM4MTAwMThlMiIsImpvYkxvY2F0aW9uIjoiQmFuZ2Fsb3JlLCBLYXJuYXRha2EiLCJqb2JUaXRsZSI6IjVHIENsb3VkIFNvZnR3YXJlIERldmVsb3BlciIsImxvY2FsZSI6ImVuX0lOIiwib25jbGljayI6ImFwcGx5Y2xpY2sifSwiYWRfdXJsIjoiXC9hcHBseTJcL21haW4/YXBwbHlfa2V5PWZkODdiZTdmNzM0MWZhMzc3OGNlNzY0MTYyNDhmYzhkJmVtYWlsPWE3MmQ4NzRlZTg3MzMzZGUzMzE2ZmJjMzE1ZDgzYjMwOTYzZDhjMjA4YjIwYjQwN2VhN2ViODZjMzljMDUxMmY0YjU1MTgyYWQ1OGZkM2QxMzE1MzUyNDQ1YzIyNTAwZTNiYWMxNDRkZWFmOWVlOTJiNjBkZWU3OGY0NzM3NGNmMDg2ODZjNzI0OTEwMTMyOGMyNDM4N2RmOTRkMTNkMjgmaGw9ZW5fSU4mam9iQ29tcGFueU5hbWU9Sm9iczJHcmFiJmpvYkludGVybmFsUmVmPWluNDdlYzMzNjBlNmRlMDNiNTNlNzAwZTczODEwMDE4ZTImam9iTG9jYXRpb249QmFuZ2Fsb3JlJTJDK0thcm5hdGFrYSZqb2JUaXRsZT01RytDbG91ZCtTb2Z0d2FyZStEZXZlbG9wZXImbG9jYWxlPWVuX0lOJm9uY2xpY2s9YXBwbHljbGljayIsImNzcmZfdG9rZW4iOiJmMDZhZGYxMzg1YTJhZjliNzk2MDU1YThhMjhlMmUzMTlhODdhMWY2IiwiZXhwaXJlcyI6MjAyMjUwMzIyNSwiaGFzX2N2IjoxLCJwaG90b19rZXkiOiI4Y2I3MzRlNmZlZTg0NmFmMjYyNDA2Yjc1ZDAyNTFiOSIsInF1ZXN0aW9uc193aGVuIjoxNzA3MTQzMjE3NDcwfQ----ea4286fecfde2b4b6a379d9bd5cdbfcaef3b9707; _ga_KMMR5L090L=GS1.1.1707142608.15.1.1707143808.0.0.0; t=a32f56edc51e8eb523e4999b04740d9c; session=eyJjc3JmX3Rva2VuIjoiNWQzZDBmOTQ1OGRmZDZhYjkwMGUzNGFlMTFlNTI0MWIwMmQ0YTkyZiIsImV4cGlyZXMiOjIwMjI1MDM4MDgsImdvb2dsZV9yZWRpciI6Imh0dHBzOlwvXC93d3cuY2FyZWVyamV0LmNvLmluXC91c2VyXC9zaWduaW5cL2dvb2dsZSIsImdvb2dsZV9zdGF0ZSI6IjQ0MDUxYjdmN2M2OGIxZGUzNDExZDgzMGViNWUyOTFjYmU3MDAxNmNiZDFhMzkwMWEzY2IxNmNmMTVjNWU0NDMiLCJoYXNfY3YiOjEsImxhdGVzdF9zZWFyY2giOnsibnVtX2ZvdW5kIjoxODYxNSwic2VsZWN0Ijp7ImNvbnRyYWN0X3BlcmlvZCI6IiIsImNvbnRyYWN0X3R5cGUiOiIiLCJpc19pbmNsdWRlZF9pbl9mcm9udGVuZCI6MSwiaXNfdmlzaWJsZSI6MSwibG9jYXRpb24iOiJJbmRpYSIsInJhZGl1cyI6MjUsInJhZGl1c191bml0Ijoia20iLCJzZWFyY2giOiJ3ZWIgZGV2ZWxvcGVyIn0sInNldHRpbmdzIjp7ImRvY19ib29zdCI6MSwiZmlsdGVyX2ZhY2V0X21pbl9jb3VudCI6MywiZnFfZmFjZXRfbWluX2NvdW50IjozLCJnZW90YXJnZXRpbmdfZmlsdGVyIjoiSU4iLCJnZXRfZmFjZXRzIjoxLCJoaWdobGlnaHRlciI6ImFsdGVybmF0aXZlIiwiaGlnaGxpZ2h0ZXJfZnJhZ21lbnRfc2l6ZSI6OTAsImxpbWl0IjoyMCwibG9jYWxlX2NvZGUiOiJlbl9JTiIsImxvY2F0aW9uX2ZhY2V0X21pbl9jb3VudCI6MywibWF4X2NoaWxkcmVuX3Blcl9sb2NhdGlvbiI6MTIsIm9mZnNldCI6MCwicHJveGltaXR5X2Jvb3N0IjoxLjEsInByb3hpbWl0eV9ib29zdF90eXBlIjoibGluZWFyIiwicmFkaXVzX3ZhbHVlcyI6WzAsNSwxMCwxNSwyNSw1MCwxMDBdLCJzb3J0IjoicmVsZXZhbmNlIiwic3BvbnNvcmVkX2xpbWl0IjoxMCwic3BvbnNvcmVkX21heF9yZXN1bHRzX3Blcl9zaXRlIjoxLCJzcG9uc29yZWRfbWluX3F1YWxpdHlfZmFjdG9yIjowLjF9fSwicGhvdG9fa2V5IjoiOGNiNzM0ZTZmZWU4NDZhZjI2MjQwNmI3NWQwMjUxYjkiLCJyZWNlbnRfc2VhcmNoZXMiOlt7ImwiOiJJbmRpYSIsImxpZCI6ODM2MjQsInIiOjAsInMiOiJ3ZWIgZGV2ZWxvcGVyIn0seyJsIjoiSW5kaWEiLCJsaWQiOjgzNjI0LCJyIjowLCJzIjoidWkgZGV2ZWxvcGVyIn0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6InVpIGRldmVsb3BlciJ9LHsibCI6Ik5vaWRhIiwibGlkIjo4NDA0MiwiciI6MjUsInMiOiJkYXRhIGVudHJ5In0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6IndlYiBkZXZlbG9wZXIifV19--8c98df92df7342a0dd0b64c61dd4db091d71c7d2",
        "Referer": `https://www.careerjet.co.in/search/jobs?s=${position}&l=${location}`,
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });
  const html = await response.text();
  const $ = cheerio.load(html);

  const dataUrls = [];
  $('article.job.clicky').each((index, element) => {
    const dataUrl = $(element).attr('data-url');
    if (dataUrl) {
      dataUrls.push(dataUrl);
    }
  });

  return dataUrls;
}

const getJobDetails = async (job) => {
  let response = await fetch(`https://www.careerjet.co.in/apply2/main?cjdl=0&applykey=${job.applyKey}&jobinternalref=${job.jobInternalRef}&jobtitle=${job.jobTitle}&jobcompanyname=${job.jobCompanyname}&joblocation=${job.jobLocation}&jobid=${job.jobId}&jobmeta=organic&onclick=applyclick`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "iframe",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "s=0c9808fa062a2cc07f9c0e33d46824ce; u=ca88ba9cce85da553c76b76f5f839d64; _ga=GA1.1.291305013.1706009621; __gsas=ID=94fe62c43a26641e:T=1706009630:RT=1706009630:S=ALNI_MYAHcVV5W8Ir7a_B5Ax0MT-mFvcyA; g_state={\"i_p\":1706787301276,\"i_l\":3}; su19hd7=4b58882d694327ebc81704811feb49753b19f8e836d1e6db2c6a79998882a892603664545bf204cd3438a89e484e38c4a0005f511ebb84672472a2b817ad7e3b6e021952b8548b4180ee21aec40c2955a79975a2f76b3407144cc838b3e1bbc4098637681ea8c38d; as=0; mojolicious=eyJhZCI6eyJhcHBseV9rZXkiOiJmZDg3YmU3ZjczNDFmYTM3NzhjZTc2NDE2MjQ4ZmM4ZCIsImVtYWlsIjoiYTcyZDg3NGVlODczMzNkZTMzMTZmYmMzMTVkODNiMzA5NjNkOGMyMDhiMjBiNDA3ZWE3ZWI4NmMzOWMwNTEyZjRiNTUxODJhZDU4ZmQzZDEzMTUzNTI0NDVjMjI1MDBlM2JhYzE0NGRlYWY5ZWU5MmI2MGRlZTc4ZjQ3Mzc0Y2YwODY4NmM3MjQ5MTAxMzI4YzI0Mzg3ZGY5NGQxM2QyOCIsImhsIjoiZW5fSU4iLCJqb2JDb21wYW55TmFtZSI6IkpvYnMyR3JhYiIsImpvYkludGVybmFsUmVmIjoiaW40N2VjMzM2MGU2ZGUwM2I1M2U3MDBlNzM4MTAwMThlMiIsImpvYkxvY2F0aW9uIjoiQmFuZ2Fsb3JlLCBLYXJuYXRha2EiLCJqb2JUaXRsZSI6IjVHIENsb3VkIFNvZnR3YXJlIERldmVsb3BlciIsImxvY2FsZSI6ImVuX0lOIiwib25jbGljayI6ImFwcGx5Y2xpY2sifSwiYWRfdXJsIjoiXC9hcHBseTJcL21haW4/YXBwbHlfa2V5PWZkODdiZTdmNzM0MWZhMzc3OGNlNzY0MTYyNDhmYzhkJmVtYWlsPWE3MmQ4NzRlZTg3MzMzZGUzMzE2ZmJjMzE1ZDgzYjMwOTYzZDhjMjA4YjIwYjQwN2VhN2ViODZjMzljMDUxMmY0YjU1MTgyYWQ1OGZkM2QxMzE1MzUyNDQ1YzIyNTAwZTNiYWMxNDRkZWFmOWVlOTJiNjBkZWU3OGY0NzM3NGNmMDg2ODZjNzI0OTEwMTMyOGMyNDM4N2RmOTRkMTNkMjgmaGw9ZW5fSU4mam9iQ29tcGFueU5hbWU9Sm9iczJHcmFiJmpvYkludGVybmFsUmVmPWluNDdlYzMzNjBlNmRlMDNiNTNlNzAwZTczODEwMDE4ZTImam9iTG9jYXRpb249QmFuZ2Fsb3JlJTJDK0thcm5hdGFrYSZqb2JUaXRsZT01RytDbG91ZCtTb2Z0d2FyZStEZXZlbG9wZXImbG9jYWxlPWVuX0lOJm9uY2xpY2s9YXBwbHljbGljayIsImNzcmZfdG9rZW4iOiJmMDZhZGYxMzg1YTJhZjliNzk2MDU1YThhMjhlMmUzMTlhODdhMWY2IiwiZXhwaXJlcyI6MjAyMjUwMzIyNSwiaGFzX2N2IjoxLCJwaG90b19rZXkiOiI4Y2I3MzRlNmZlZTg0NmFmMjYyNDA2Yjc1ZDAyNTFiOSIsInF1ZXN0aW9uc193aGVuIjoxNzA3MTQzMjE3NDcwfQ----ea4286fecfde2b4b6a379d9bd5cdbfcaef3b9707; o=2; t=eadbf571e1494a00ad26148c95cf0ce0; session=eyJjc3JmX3Rva2VuIjoiNWQzZDBmOTQ1OGRmZDZhYjkwMGUzNGFlMTFlNTI0MWIwMmQ0YTkyZiIsImV4cGlyZXMiOjIwMjI1MDUyNjAsImdvb2dsZV9yZWRpciI6Imh0dHBzOlwvXC93d3cuY2FyZWVyamV0LmNvLmluXC91c2VyXC9zaWduaW5cL2dvb2dsZSIsImdvb2dsZV9zdGF0ZSI6IjQ0MDUxYjdmN2M2OGIxZGUzNDExZDgzMGViNWUyOTFjYmU3MDAxNmNiZDFhMzkwMWEzY2IxNmNmMTVjNWU0NDMiLCJoYXNfY3YiOjEsImxhdGVzdF9zZWFyY2giOnsibnVtX2ZvdW5kIjoyMSwic2VsZWN0Ijp7ImNvbnRyYWN0X3BlcmlvZCI6IiIsImNvbnRyYWN0X3R5cGUiOiIiLCJoYXNfYXBwbHlfa2V5IjoxLCJpc19pbmNsdWRlZF9pbl9mcm9udGVuZCI6MSwiaXNfdmlzaWJsZSI6MSwibG9jYXRpb24iOiJub2lkYSIsImxvY2F0aW9uX2NqaWQiOiI4NDA0MiIsInJhZGl1cyI6MjUsInJhZGl1c191bml0Ijoia20iLCJzZWFyY2giOiJ3ZWIgZGV2ZWxvcGVyIn0sInNldHRpbmdzIjp7ImRvY19ib29zdCI6MSwiZmlsdGVyX2ZhY2V0X21pbl9jb3VudCI6MywiZnFfZmFjZXRfbWluX2NvdW50IjozLCJnZW90YXJnZXRpbmdfZmlsdGVyIjoiSU4iLCJnZXRfZmFjZXRzIjoxLCJoaWdobGlnaHRlciI6ImFsdGVybmF0aXZlIiwiaGlnaGxpZ2h0ZXJfZnJhZ21lbnRfc2l6ZSI6OTAsImxpbWl0IjoyMCwibG9jYWxlX2NvZGUiOiJlbl9JTiIsImxvY2F0aW9uX2ZhY2V0X21pbl9jb3VudCI6MywibWF4X2NoaWxkcmVuX3Blcl9sb2NhdGlvbiI6MTIsIm9mZnNldCI6MCwicHJveGltaXR5X2Jvb3N0IjoxLjEsInByb3hpbWl0eV9ib29zdF90eXBlIjoibGluZWFyIiwicmFkaXVzX3ZhbHVlcyI6WzAsNSwxMCwxNSwyNSw1MCwxMDBdLCJzb3J0IjoicmVsZXZhbmNlIiwic3BvbnNvcmVkX2xpbWl0IjoxMCwic3BvbnNvcmVkX21heF9yZXN1bHRzX3Blcl9zaXRlIjoxLCJzcG9uc29yZWRfbWluX3F1YWxpdHlfZmFjdG9yIjowLjF9fSwicGhvdG9fa2V5IjoiOGNiNzM0ZTZmZWU4NDZhZjI2MjQwNmI3NWQwMjUxYjkiLCJyZWNlbnRfc2VhcmNoZXMiOlt7ImwiOiJOb2lkYSIsImxpZCI6ODQwNDIsInIiOjI1LCJzIjoid2ViIGRldmVsb3BlciJ9LHsibCI6IkluZGlhIiwibGlkIjo4MzYyNCwiciI6MCwicyI6IndlYiBkZXZlbG9wZXIifSx7ImwiOiJJbmRpYSIsImxpZCI6ODM2MjQsInIiOjAsInMiOiJ1aSBkZXZlbG9wZXIifSx7ImwiOiJOb2lkYSIsImxpZCI6ODQwNDIsInIiOjI1LCJzIjoidWkgZGV2ZWxvcGVyIn0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6ImRhdGEgZW50cnkifV19--207c31eaa9758c6b05159f052e60339df71a5fa3; _ga_KMMR5L090L=GS1.1.1707142608.15.1.1707145260.0.0.0",
      "Referer": `https://www.careerjet.co.in${job.jobId}`,
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const questions = {};

  $('div[data-qid]').each((index, element) => {
    const div = $(element);
    const qid = div.attr('data-qid');
    if (div.attr('data-type') === 'upload') {
      questions["q4-filekey"] = div.find('input[name="q4-filekey"]').val();
      questions["q4-occupation"] = "Occupation";
      questions["q4-location"] = "Location";
      questions["q4"] = "Upload your resume";
    } else {
      const spamValue = div.find('.label').text().trim();
      questions[qid] = spamValue;
    }
  });

  return questions;
}

const getJob = async (jobURL) => {
  let response = await fetch(`https://www.careerjet.co.in${jobURL}`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": "s=0c9808fa062a2cc07f9c0e33d46824ce; u=ca88ba9cce85da553c76b76f5f839d64; _ga=GA1.1.291305013.1706009621; __gsas=ID=94fe62c43a26641e:T=1706009630:RT=1706009630:S=ALNI_MYAHcVV5W8Ir7a_B5Ax0MT-mFvcyA; g_state={\"i_p\":1706787301276,\"i_l\":3}; su19hd7=4b58882d694327ebc81704811feb49753b19f8e836d1e6db2c6a79998882a892603664545bf204cd3438a89e484e38c4a0005f511ebb84672472a2b817ad7e3b6e021952b8548b4180ee21aec40c2955a79975a2f76b3407144cc838b3e1bbc4098637681ea8c38d; as=0; mojolicious=eyJhZCI6eyJhcHBseV9rZXkiOiJmZDg3YmU3ZjczNDFmYTM3NzhjZTc2NDE2MjQ4ZmM4ZCIsImVtYWlsIjoiYTcyZDg3NGVlODczMzNkZTMzMTZmYmMzMTVkODNiMzA5NjNkOGMyMDhiMjBiNDA3ZWE3ZWI4NmMzOWMwNTEyZjRiNTUxODJhZDU4ZmQzZDEzMTUzNTI0NDVjMjI1MDBlM2JhYzE0NGRlYWY5ZWU5MmI2MGRlZTc4ZjQ3Mzc0Y2YwODY4NmM3MjQ5MTAxMzI4YzI0Mzg3ZGY5NGQxM2QyOCIsImhsIjoiZW5fSU4iLCJqb2JDb21wYW55TmFtZSI6IkpvYnMyR3JhYiIsImpvYkludGVybmFsUmVmIjoiaW40N2VjMzM2MGU2ZGUwM2I1M2U3MDBlNzM4MTAwMThlMiIsImpvYkxvY2F0aW9uIjoiQmFuZ2Fsb3JlLCBLYXJuYXRha2EiLCJqb2JUaXRsZSI6IjVHIENsb3VkIFNvZnR3YXJlIERldmVsb3BlciIsImxvY2FsZSI6ImVuX0lOIn0sImFkX3VybCI6IlwvYXBwbHkyXC9tYWluP2FwcGx5X2tleT1mZDg3YmU3ZjczNDFmYTM3NzhjZTc2NDE2MjQ4ZmM4ZCZlbWFpbD1hNzJkODc0ZWU4NzMzM2RlMzMxNmZiYzMxNWQ4M2IzMDk2M2Q4YzIwOGIyMGI0MDdlYTdlYjg2YzM5YzA1MTJmNGI1NTE4MmFkNThmZDNkMTMxNTM1MjQ0NWMyMjUwMGUzYmFjMTQ0ZGVhZjllZTkyYjYwZGVlNzhmNDczNzRjZjA4Njg2YzcyNDkxMDEzMjhjMjQzODdkZjk0ZDEzZDI4JmhsPWVuX0lOJmpvYkNvbXBhbnlOYW1lPUpvYnMyR3JhYiZqb2JJbnRlcm5hbFJlZj1pbjQ3ZWMzMzYwZTZkZTAzYjUzZTcwMGU3MzgxMDAxOGUyJmpvYkxvY2F0aW9uPUJhbmdhbG9yZSUyQytLYXJuYXRha2Emam9iVGl0bGU9NUcrQ2xvdWQrU29mdHdhcmUrRGV2ZWxvcGVyJmxvY2FsZT1lbl9JTiIsImNzcmZfdG9rZW4iOiJmMDZhZGYxMzg1YTJhZjliNzk2MDU1YThhMjhlMmUzMTlhODdhMWY2IiwiZXhwaXJlcyI6MjAyMjUwNjI1MCwiaGFzX2N2IjoxLCJwaG90b19rZXkiOiI4Y2I3MzRlNmZlZTg0NmFmMjYyNDA2Yjc1ZDAyNTFiOSIsInF1ZXN0aW9uc193aGVuIjoxNzA3MTQ2MjMxNzM2fQ----1d0d8c899028e318bfcd69d52c185ad952c27403; t=c87f57130294d0a630aff67cdd67f5aa; session=eyJjc3JmX3Rva2VuIjoiNWQzZDBmOTQ1OGRmZDZhYjkwMGUzNGFlMTFlNTI0MWIwMmQ0YTkyZiIsImV4cGlyZXMiOjIwMjI1MDY1NTUsImdvb2dsZV9yZWRpciI6Imh0dHBzOlwvXC93d3cuY2FyZWVyamV0LmNvLmluXC91c2VyXC9zaWduaW5cL2dvb2dsZSIsImdvb2dsZV9zdGF0ZSI6IjQ0MDUxYjdmN2M2OGIxZGUzNDExZDgzMGViNWUyOTFjYmU3MDAxNmNiZDFhMzkwMWEzY2IxNmNmMTVjNWU0NDMiLCJoYXNfY3YiOjEsImxhdGVzdF9zZWFyY2giOnsibnVtX2ZvdW5kIjo0LCJzZWxlY3QiOnsiY29udHJhY3RfcGVyaW9kIjoiIiwiY29udHJhY3RfdHlwZSI6IiIsImhhc19hcHBseV9rZXkiOjEsImlzX2luY2x1ZGVkX2luX2Zyb250ZW5kIjoxLCJpc192aXNpYmxlIjoxLCJsb2NhdGlvbiI6Im5vaWRhIiwibG9jYXRpb25fY2ppZCI6Ijg0MDQyIiwicmFkaXVzIjoyNSwicmFkaXVzX3VuaXQiOiJrbSIsInNlYXJjaCI6IndlYiBkZXNpZ25lciJ9LCJzZXR0aW5ncyI6eyJkb2NfYm9vc3QiOjEsImZpbHRlcl9mYWNldF9taW5fY291bnQiOjMsImZxX2ZhY2V0X21pbl9jb3VudCI6MywiZ2VvdGFyZ2V0aW5nX2ZpbHRlciI6IklOIiwiZ2V0X2ZhY2V0cyI6MSwiaGlnaGxpZ2h0ZXIiOiJhbHRlcm5hdGl2ZSIsImhpZ2hsaWdodGVyX2ZyYWdtZW50X3NpemUiOjkwLCJsaW1pdCI6MjAsImxvY2FsZV9jb2RlIjoiZW5fSU4iLCJsb2NhdGlvbl9mYWNldF9taW5fY291bnQiOjMsIm1heF9jaGlsZHJlbl9wZXJfbG9jYXRpb24iOjEyLCJvZmZzZXQiOjAsInByb3hpbWl0eV9ib29zdCI6MS4xLCJwcm94aW1pdHlfYm9vc3RfdHlwZSI6ImxpbmVhciIsInJhZGl1c192YWx1ZXMiOlswLDUsMTAsMTUsMjUsNTAsMTAwXSwic29ydCI6InJlbGV2YW5jZSIsInNwb25zb3JlZF9saW1pdCI6MTAsInNwb25zb3JlZF9tYXhfcmVzdWx0c19wZXJfc2l0ZSI6MSwic3BvbnNvcmVkX21pbl9xdWFsaXR5X2ZhY3RvciI6MC4xfX0sInBob3RvX2tleSI6IjhjYjczNGU2ZmVlODQ2YWYyNjI0MDZiNzVkMDI1MWI5IiwicmVjZW50X3NlYXJjaGVzIjpbeyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6IndlYiBkZXNpZ25lciJ9LHsibCI6Ik5vaWRhIiwibGlkIjo4NDA0MiwiciI6MjUsInMiOiIke3Bvc2l0aW9ufSJ9LHsibCI6Ik5vaWRhIiwibGlkIjo4NDA0MiwiciI6MjUsInMiOiJ3ZWIgZGV2ZWxvcGVyIn0seyJsIjoiSW5kaWEiLCJsaWQiOjgzNjI0LCJyIjowLCJzIjoid2ViIGRldmVsb3BlciJ9LHsibCI6IkluZGlhIiwibGlkIjo4MzYyNCwiciI6MCwicyI6InVpIGRldmVsb3BlciJ9XX0---c9e6073cfdd9c91f5ef631198e2335669ac41954; _ga_KMMR5L090L=GS1.1.1707142608.15.1.1707146555.0.0.0; o=0",
      "Referer": "https://www.careerjet.co.in/web-designer-jobs/noida-84042.html?ay=1",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const joburl = $('span[data-cjapply-joburl]').attr('data-cjapply-joburl');
  const posturl = $('span[data-cjapply-posturl]').attr('data-cjapply-posturl');
  const email = $('span[data-cjapply-email]').attr('data-cjapply-email');

  const csrf_token = $('input[name="csrf_token"]').attr('value');

  const cjdl = $('span[data-cjapply-cjdl]').attr('data-cjapply-cjdl');
  const lp = $('span[data-cjapply-lp]').attr('data-cjapply-lp');
  const applyKey = $('span[data-cjapply-applykey]').attr('data-cjapply-applykey');
  const jobInternalRef = $('span[data-cjapply-jobinternalref]').attr('data-cjapply-jobinternalref');
  const jobTitle = $('span[data-cjapply-jobtitle]').attr('data-cjapply-jobtitle');
  const jobCompanyname = $('span[data-cjapply-jobcompanyname]').attr('data-cjapply-jobcompanyname');
  const jobLocation = $('span[data-cjapply-joblocation]').attr('data-cjapply-joblocation');
  const jobId = $('span[data-cjapply-jobid]').attr('data-cjapply-jobid');

  return { csrf_token, email, joburl, posturl, cjdl, lp, applyKey, jobInternalRef, jobTitle, jobCompanyname, jobLocation, jobId, jobURL };
}

const applyJob = async (job) => {
  let data = {
    "csrf_token": job.csrf_token,
    "q0": "Ujjwal",
    "q1": "Pathak",
    "q2": "pathak2002ujjwal@gmail.com",
    "q4-filekey": job.Ques["q4-filekey"],
    "q4-occupation": "Occupation",
    "q4-location": "Location",
    "q4": "",
  }

  if (job.email === undefined) {
    response = await
      fetch(`https://www.careerjet.co.in/apply2/main?lp=${encodeURIComponent(job.lp)}&cjdl=${encodeURIComponent(job.cjdl)}&applykey=${encodeURIComponent(job.applyKey)}&jobinternalref=${encodeURIComponent(job.jobInternalRef)}&jobtitle=${job.jobTitle}&jobcompanyname=${job.jobCompanyname}&joblocation=${job.jobLocation}&jobid=${encodeURIComponent(job.jobId)}&joburl=${encodeURIComponent(job.jobURL)}&posturl=${encodeURIComponent(job.posturl)}&onclick=applyclick`, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,hi;q=0.8",
          "cache-control": "max-age=0",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundary4TeBxsRbOXjIxiaH",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "iframe",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "s=0c9808fa062a2cc07f9c0e33d46824ce; u=ca88ba9cce85da553c76b76f5f839d64; _ga=GA1.1.291305013.1706009621; __gsas=ID=94fe62c43a26641e:T=1706009630:RT=1706009630:S=ALNI_MYAHcVV5W8Ir7a_B5Ax0MT-mFvcyA; g_state={\"i_p\":1706787301276,\"i_l\":3}; su19hd7=4b58882d694327ebc81704811feb49753b19f8e836d1e6db2c6a79998882a892603664545bf204cd3438a89e484e38c4a0005f511ebb84672472a2b817ad7e3b6e021952b8548b4180ee21aec40c2955a79975a2f76b3407144cc838b3e1bbc4098637681ea8c38d; as=1; o=0; _ga_KMMR5L090L=GS1.1.1707153329.17.1.1707153755.0.0.0; t=e463ba672de5f964b9ea79f5995d43ac; session=eyJjc3JmX3Rva2VuIjoiNWQzZDBmOTQ1OGRmZDZhYjkwMGUzNGFlMTFlNTI0MWIwMmQ0YTkyZiIsImV4cGlyZXMiOjIwMjI1MTM3NjgsImdvb2dsZV9yZWRpciI6Imh0dHBzOlwvXC93d3cuY2FyZWVyamV0LmNvLmluXC91c2VyXC9zaWduaW5cL2dvb2dsZSIsImdvb2dsZV9zdGF0ZSI6IjQ0MDUxYjdmN2M2OGIxZGUzNDExZDgzMGViNWUyOTFjYmU3MDAxNmNiZDFhMzkwMWEzY2IxNmNmMTVjNWU0NDMiLCJoYXNfY3YiOjEsImxhdGVzdF9zZWFyY2giOnsibnVtX2ZvdW5kIjo1OCwic2VsZWN0Ijp7ImNvbnRyYWN0X3BlcmlvZCI6IiIsImNvbnRyYWN0X3R5cGUiOiIiLCJoYXNfYXBwbHlfa2V5IjoxLCJpc19pbmNsdWRlZF9pbl9mcm9udGVuZCI6MSwiaXNfdmlzaWJsZSI6MSwibG9jYXRpb24iOiJiYW5nYWxvcmUiLCJsb2NhdGlvbl9jamlkIjoiODM3NzkiLCJyYWRpdXMiOjAsInJhZGl1c191bml0Ijoia20iLCJzZWFyY2giOiJ1aSBkZXZlbG9wZXIifSwic2V0dGluZ3MiOnsiZG9jX2Jvb3N0IjoxLCJmaWx0ZXJfZmFjZXRfbWluX2NvdW50IjozLCJmcV9mYWNldF9taW5fY291bnQiOjMsImdlb3RhcmdldGluZ19maWx0ZXIiOiJJTiIsImdldF9mYWNldHMiOjEsImhpZ2hsaWdodGVyIjoiYWx0ZXJuYXRpdmUiLCJoaWdobGlnaHRlcl9mcmFnbWVudF9zaXplIjo5MCwibGltaXQiOjIwLCJsb2NhbGVfY29kZSI6ImVuX0lOIiwibG9jYXRpb25fZmFjZXRfbWluX2NvdW50IjozLCJtYXhfY2hpbGRyZW5fcGVyX2xvY2F0aW9uIjoxMiwib2Zmc2V0IjowLCJwcm94aW1pdHlfYm9vc3QiOjEuMSwicHJveGltaXR5X2Jvb3N0X3R5cGUiOiJsaW5lYXIiLCJyYWRpdXNfdmFsdWVzIjpbMCw1LDEwLDE1LDI1LDUwLDEwMF0sInNvcnQiOiJyZWxldmFuY2UiLCJzcG9uc29yZWRfbGltaXQiOjEwLCJzcG9uc29yZWRfbWF4X3Jlc3VsdHNfcGVyX3NpdGUiOjEsInNwb25zb3JlZF9taW5fcXVhbGl0eV9mYWN0b3IiOjAuMX19LCJwaG90b19rZXkiOiI4Y2I3MzRlNmZlZTg0NmFmMjYyNDA2Yjc1ZDAyNTFiOSIsInJlY2VudF9zZWFyY2hlcyI6W3sibCI6IkJhbmdhbG9yZSIsImxpZCI6ODM3NzksInIiOjAsInMiOiJ1aSBkZXZlbG9wZXIifSx7ImwiOiJJbmRpYSIsImxpZCI6ODM2MjQsInIiOjAsInMiOiJ1aSBkZXZlbG9wZXIifSx7ImwiOiJOb2lkYSIsImxpZCI6ODQwNDIsInIiOjI1LCJzIjoid2ViIGRlc2lnbmVyIn0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6IiR7cG9zaXRpb259In0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6IndlYiBkZXZlbG9wZXIifV19--dce0e4d9c156c3849e38e2a0412c417d790b8f66; mojolicious=eyJhZCI6eyJhcHBseV9rZXkiOiI1YzUyZGRjNWMxNDdlMjZlODQ2NWU4YjIyZDBiOWU0NyIsImVtYWlsIjoiIiwiaGwiOiJlbl9JTiIsImpvYkNvbXBhbnlOYW1lIjoiTVVGRyIsImpvYklkIjoiVDUwMC05Njc4Iiwiam9iSW50ZXJuYWxSZWYiOiJpbjZjNGM5Njc3ZjdjZTJiMWMwMmQ5OGEzZDlhNWZiOGIzIiwiam9iTG9jYXRpb24iOiJCYW5nYWxvcmUsIEthcm5hdGFrYSIsImpvYlRpdGxlIjoiRnVsbCBzdGFjayAuTmV0IERldmVsb3BlclwvV2ViIERldmVsb3BlciIsImpvYlVybCI6Imh0dHBzOlwvXC90YWxlbnQ1MDAuY29cL2pvYnNcL211ZmdcL3Nlbmlvci1mdWxsc3RhY2stZGV2ZWxvcGVyLW5ldC1hbmd1bGFyLWJlbmdhbHVydS1UNTAwLTk2NzgiLCJsZWFkX3ByaWNlIjoiNzQ2ZmI4MDYzNmY0MWUzZTNmNGQ5ZDRjNDIzZmIzOTAiLCJsb2NhbGUiOiJlbl9VUyIsIm9uY2xpY2siOiJhcHBseWNsaWNrIiwicG9zdFVybCI6Imh0dHBzOlwvXC9wcm9kLXdhcm1hY2hpbmUudGFsZW50NTAwLmNvXC9hcGlcL3ZlbmRvclwvdmVuZG9yLWpvYi1hcHBsaWNhdGlvblwvY2FyZWVyamV0XC8/dG9rZW49Yzc5ZTNmMzI3MDQwNWExOXBzMTM5MzBiN2FiMmExY28ifSwiYWRfdXJsIjoiXC9hcHBseTJcL21haW4/YXBwbHlfa2V5PTVjNTJkZGM1YzE0N2UyNmU4NDY1ZThiMjJkMGI5ZTQ3JmhsPWVuX0lOJmpvYkNvbXBhbnlOYW1lPU1VRkcmam9iSWQ9VDUwMC05Njc4JmpvYkludGVybmFsUmVmPWluNmM0Yzk2NzdmN2NlMmIxYzAyZDk4YTNkOWE1ZmI4YjMmam9iTG9jYXRpb249QmFuZ2Fsb3JlJTJDK0thcm5hdGFrYSZqb2JUaXRsZT1GdWxsK3N0YWNrKy5OZXQrRGV2ZWxvcGVyJTJGV2ViK0RldmVsb3BlciZqb2JVcmw9aHR0cHMlM0ElMkYlMkZ0YWxlbnQ1MDAuY28lMkZqb2JzJTJGbXVmZyUyRnNlbmlvci1mdWxsc3RhY2stZGV2ZWxvcGVyLW5ldC1hbmd1bGFyLWJlbmdhbHVydS1UNTAwLTk2NzgmbG9jYWxlPWVuX1VTJmxwPTc0NmZiODA2MzZmNDFlM2UzZjRkOWQ0YzQyM2ZiMzkwJm9uY2xpY2s9YXBwbHljbGljayZwb3N0VXJsPWh0dHBzJTNBJTJGJTJGcHJvZC13YXJtYWNoaW5lLnRhbGVudDUwMC5jbyUyRmFwaSUyRnZlbmRvciUyRnZlbmRvci1qb2ItYXBwbGljYXRpb24lMkZjYXJlZXJqZXQlMkYlM0Z0b2tlbiUzRGM3OWUzZjMyNzA0MDVhMTlwczEzOTMwYjdhYjJhMWNvIiwiY3NyZl90b2tlbiI6ImYwNmFkZjEzODVhMmFmOWI3OTYwNTVhOGEyOGUyZTMxOWE4N2ExZjYiLCJleHBpcmVzIjoyMDIyNTEzNzY4LCJoYXNfY3YiOjEsInBob3RvX2tleSI6IjhjYjczNGU2ZmVlODQ2YWYyNjI0MDZiNzVkMDI1MWI5IiwicXVlc3Rpb25zX3doZW4iOjE3MDcxNTM3Njg1OTd9--2c06ff8b414fd74b0d8eb0965c1e4c143caff9d9",
          "Referer": `https://www.careerjet.co.in/apply2/main?lp=${encodeURIComponent(job.lp)}&cjdl=${encodeURIComponent(job.cjdl)}&applykey=${encodeURIComponent(job.applyKey)}&jobinternalref=${encodeURIComponent(job.jobInternalRef)}&jobtitle=${job.jobTitle}&joburl=${encodeURIComponent(job.joburl)}&posturl=${encodeURIComponent(job.posturl)}&onclick=applyclick`,
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"gcpc3_log\"\r\n\r\nA-1707164861536-B-452-C-452\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"gcpc3\"\r\n\r\n03AFcWeA5xIFRx7Fna-lJIKav5LfhK3PH1dEIEWK5_GZLeVP94MvcrkEkT5aYXBfp83BDCrYSIRkzTFX3bxW37FTP9qcRScxFhADs6hM0sZKMm83sLYq-sBl4nhNk0Y4YZlYQsHFPramgKKPii549exZ9lixdxtiLG_ED5aipLPxGUVGTiFLEnCx8Orf_W1EsYTz-O7Tz-eDpevdyI2sl8TSd2IwIOsgR49yhN_39IW5UKhDPVPSRedjtiKz4s8xwweVg1HTA__vXi2uarbRwpR-jbOLhIzV5rQ7V8hQn3otWTwq9L1dxiKnJYK7XHBJJeGm1CzwB5GAam5fk0i1DnrbyzhoDNExJYAypDXHn995CPTqUrpILGIN2xvgR5Da93Y7qQj_gBgQ49K5yLsGwRVVwArdIgSR4WHgrrlbk0TY15W4H-ZXgeG4bdajPF66P8QKEZhvLUe0o8WpHuuCDa2_dHI0u1bQgYCmDhG4905FsbRFBhOjzGjWWASKjh9D5FOwXGj8SmZYgtdHPKUI0Ackx_McvvdyFg6-QVD1a86zluWQ_L0ZFZ5_NpaAWNyNPh2MfSBYI_kiztT8AZy_bBVseE-u8WX5Q9iQ\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"csrf_token\"\r\n\r\nf06adf1385a2af9b796055a8a28e2e319a87a1f6\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q0\"\r\n\r\nUjjwal\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q1\"\r\n\r\nPathak\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q2\"\r\n\r\npathak2002ujjwal@gmail.com\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q30\"\r\n\r\n\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q4-filekey\"\r\n\r\n0c0dbcbcfa7b1f62\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q4\"; filename=\"\"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q4-occupation\"\r\n\r\nWipro\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q4-location\"\r\n\r\nAndhra Pradesh\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"q6\"\r\n\r\n\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN\r\nContent-Disposition: form-data; name=\"fp\"\r\n\r\nd6661e63326b5e6f5cda601e510e4726\r\n------WebKitFormBoundaryqKTzbtvimgbqwVrN--\r\n",
        "method": "POST"
      });
  }
  else {
    response = await
      fetch(`https://www.careerjet.co.in/apply2/main?cjdl=${encodeURIComponent(job.cjdl)}&applykey=${encodeURIComponent(job.applyKey)}&jobinternalref=${encodeURIComponent(job.jobInternalRef)}&jobtitle=${job.jobTitle}&jobcompanyname=${job.jobCompanyname}&joblocation=${job.jobLocation}&email=${encodeURIComponent(job.email)}&locale=en_IN&onclick=applyclick`, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,hi;q=0.8",
          "cache-control": "max-age=0",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryqKTzbtvimgbqwVrN",
          "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "iframe",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          "cookie": "s=0c9808fa062a2cc07f9c0e33d46824ce; u=ca88ba9cce85da553c76b76f5f839d64; _ga=GA1.1.291305013.1706009621; __gsas=ID=94fe62c43a26641e:T=1706009630:RT=1706009630:S=ALNI_MYAHcVV5W8Ir7a_B5Ax0MT-mFvcyA; g_state={\"i_p\":1706787301276,\"i_l\":3}; su19hd7=4b58882d694327ebc81704811feb49753b19f8e836d1e6db2c6a79998882a892603664545bf204cd3438a89e484e38c4a0005f511ebb84672472a2b817ad7e3b6e021952b8548b4180ee21aec40c2955a79975a2f76b3407144cc838b3e1bbc4098637681ea8c38d; as=0; o=3; _ga_KMMR5L090L=GS1.1.1707153329.17.1.1707160481.0.0.0; t=7e404d194af2b95da8262880929ed8b9; session=eyJjc3JmX3Rva2VuIjoiNWQzZDBmOTQ1OGRmZDZhYjkwMGUzNGFlMTFlNTI0MWIwMmQ0YTkyZiIsImV4cGlyZXMiOjIwMjI1MjA0ODksImdvb2dsZV9yZWRpciI6Imh0dHBzOlwvXC93d3cuY2FyZWVyamV0LmNvLmluXC91c2VyXC9zaWduaW5cL2dvb2dsZSIsImdvb2dsZV9zdGF0ZSI6IjQ0MDUxYjdmN2M2OGIxZGUzNDExZDgzMGViNWUyOTFjYmU3MDAxNmNiZDFhMzkwMWEzY2IxNmNmMTVjNWU0NDMiLCJoYXNfY3YiOjEsImxhdGVzdF9zZWFyY2giOnsibnVtX2ZvdW5kIjoxMjI1LCJzZWxlY3QiOnsiY29udHJhY3RfcGVyaW9kIjoiIiwiY29udHJhY3RfdHlwZSI6IiIsImlzX2luY2x1ZGVkX2luX2Zyb250ZW5kIjoxLCJpc192aXNpYmxlIjoxLCJsb2NhdGlvbiI6IkJhbmdhbG9yZSIsInJhZGl1cyI6MjUsInJhZGl1c191bml0Ijoia20iLCJzZWFyY2giOiJkYXRhIGVudHJ5In0sInNldHRpbmdzIjp7ImRvY19ib29zdCI6MSwiZmlsdGVyX2ZhY2V0X21pbl9jb3VudCI6MywiZnFfZmFjZXRfbWluX2NvdW50IjozLCJnZW90YXJnZXRpbmdfZmlsdGVyIjoiSU4iLCJnZXRfZmFjZXRzIjoxLCJoaWdobGlnaHRlciI6ImFsdGVybmF0aXZlIiwiaGlnaGxpZ2h0ZXJfZnJhZ21lbnRfc2l6ZSI6OTAsImxpbWl0IjoyMCwibG9jYWxlX2NvZGUiOiJlbl9JTiIsImxvY2F0aW9uX2ZhY2V0X21pbl9jb3VudCI6MywibWF4X2NoaWxkcmVuX3Blcl9sb2NhdGlvbiI6MTIsIm9mZnNldCI6MCwicHJveGltaXR5X2Jvb3N0IjoxLjEsInByb3hpbWl0eV9ib29zdF90eXBlIjoibGluZWFyIiwicmFkaXVzX3ZhbHVlcyI6WzAsNSwxMCwxNSwyNSw1MCwxMDBdLCJzb3J0IjoicmVsZXZhbmNlIiwic3BvbnNvcmVkX2xpbWl0IjoxMCwic3BvbnNvcmVkX21heF9yZXN1bHRzX3Blcl9zaXRlIjoxLCJzcG9uc29yZWRfbWluX3F1YWxpdHlfZmFjdG9yIjowLjF9fSwicGhvdG9fa2V5IjoiOGNiNzM0ZTZmZWU4NDZhZjI2MjQwNmI3NWQwMjUxYjkiLCJyZWNlbnRfc2VhcmNoZXMiOlt7ImwiOiJCYW5nYWxvcmUiLCJsaWQiOjgzNzc5LCJyIjoyNSwicyI6ImRhdGEgZW50cnkifSx7ImwiOiJCYW5nYWxvcmUiLCJsaWQiOjgzNzc5LCJyIjowLCJzIjoidWkgZGV2ZWxvcGVyIn0seyJsIjoiSW5kaWEiLCJsaWQiOjgzNjI0LCJyIjowLCJzIjoidWkgZGV2ZWxvcGVyIn0seyJsIjoiTm9pZGEiLCJsaWQiOjg0MDQyLCJyIjoyNSwicyI6IndlYiBkZXNpZ25lciJ9LHsibCI6Ik5vaWRhIiwibGlkIjo4NDA0MiwiciI6MjUsInMiOiIke3Bvc2l0aW9ufSJ9XX0---e67a80b378bc5e8e42264715941654095e95632f; mojolicious=eyJhZCI6eyJhcHBseV9rZXkiOiJmZDg3YmU3ZjczNDFmYTM3NzhjZTc2NDE2MjQ4ZmM4ZCIsImVtYWlsIjoiZjc5YmFhZWNjNzFkOTU0YWM1ZGIyYTI3NDg3ZTFiMWEwNjFhMWYxMDhkODExZDkwMzU1MmUxOTFkODY0MDdjNTI2Y2M1OGEwOWQyNDRkYTZjZGM5NmJjOTQ0OGRlN2Y1NzcxN2UxODVhMjA0YmQ5ZTcxNzk2NjkxMzFlN2E3MDlhNGEzN2RjNWY2MGRjNTg5NDRlNzMzZGJhNzA1NTAxMWViMzIyYTY2MmMzN2JlODU0OWRmNzk0ZTk0MmI4ZjFkIiwiaGwiOiJlbl9JTiIsImpvYkNvbXBhbnlOYW1lIjoiUHJhZGVlcElUIENvbnN1bHRpbmcgU2VydmljZXMgUHZ0IEx0ZCIsImpvYkludGVybmFsUmVmIjoiaW4wMDFjZGEyMjI4MmE0ZjdiNjk4N2Y1MmIwODRkMzllNSIsImpvYkxvY2F0aW9uIjoiQmFuZ2Fsb3JlLCBLYXJuYXRha2EiLCJqb2JUaXRsZSI6IlVJIFBhdGggUlBBIERldmVsb3BlciIsImxvY2FsZSI6ImVuX0lOIiwib25jbGljayI6ImFwcGx5Y2xpY2sifSwiYWRfdXJsIjoiXC9hcHBseTJcL21haW4/YXBwbHlfa2V5PWZkODdiZTdmNzM0MWZhMzc3OGNlNzY0MTYyNDhmYzhkJmVtYWlsPWY3OWJhYWVjYzcxZDk1NGFjNWRiMmEyNzQ4N2UxYjFhMDYxYTFmMTA4ZDgxMWQ5MDM1NTJlMTkxZDg2NDA3YzUyNmNjNThhMDlkMjQ0ZGE2Y2RjOTZiYzk0NDhkZTdmNTc3MTdlMTg1YTIwNGJkOWU3MTc5NjY5MTMxZTdhNzA5YTRhMzdkYzVmNjBkYzU4OTQ0ZTczM2RiYTcwNTUwMTFlYjMyMmE2NjJjMzdiZTg1NDlkZjc5NGU5NDJiOGYxZCZobD1lbl9JTiZqb2JDb21wYW55TmFtZT1QcmFkZWVwSVQrQ29uc3VsdGluZytTZXJ2aWNlcytQdnQrTHRkJmpvYkludGVybmFsUmVmPWluMDAxY2RhMjIyODJhNGY3YjY5ODdmNTJiMDg0ZDM5ZTUmam9iTG9jYXRpb249QmFuZ2Fsb3JlJTJDK0thcm5hdGFrYSZqb2JUaXRsZT1VSStQYXRoK1JQQStEZXZlbG9wZXImbG9jYWxlPWVuX0lOJm9uY2xpY2s9YXBwbHljbGljayIsImNzcmZfdG9rZW4iOiJmMDZhZGYxMzg1YTJhZjliNzk2MDU1YThhMjhlMmUzMTlhODdhMWY2IiwiZXhwaXJlcyI6MjAyMjUyMDQ4OSwiaGFzX2N2IjoxLCJwaG90b19rZXkiOiI4Y2I3MzRlNmZlZTg0NmFmMjYyNDA2Yjc1ZDAyNTFiOSIsInF1ZXN0aW9uc193aGVuIjoxNzA3MTYwNDg5NTk0fQ----85e6994e31d7762bba6891e9a150967a3e6ef30c",
          "Referer": "https://www.careerjet.co.in/apply2/main?cjdl=0&applykey=d234ed64b08e11cfa1a516e15af3f369&jobinternalref=ind45428d4ef156b34e81d5a366f285400&jobtitle=Data%20entry%20operator%2FInventory%20Supervisor&jobcompanyname=White%20Force&joblocation=Bangalore%2C%20Karnataka&email=c9236d833071aa4747ad20f064d6e6c67d677441e7538cec302c8c0c4fbbf188&locale=en_IN&onclick=applyclick",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": convertToSingleLine(formDataString),
        "method": "POST"
      });
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  return html;
}

app.get("/get", async (req, res) => {
  let { position, location } = req.query;
  let URLs = await getURLs(position, location);
  console.log(URLs);

  let Jobs = [];
  for (let i = 0; i < 1; i++) {
    let job = await getJob("/jobad/ind45428d4ef156b34e81d5a366f285400");
    job["Ques"] = await getJobDetails(job);
    console.log(job);

    // applyJob(job)
    Jobs.push(job);

    Jobs[`${URLs[i]}`] = job;
  }

  res.send({Jobs, URLs});
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});


