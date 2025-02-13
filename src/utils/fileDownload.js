import JsFileDownloader from "js-file-downloader";

export const handleDownload = async (url) => {
  new JsFileDownloader({ url: url, contentTypeDetermination: "full" });
};
