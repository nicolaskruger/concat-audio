import fs from "fs";
import audioconcat from "audioconcat";
import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

ffmpeg.setFfmpegPath(path);

const extensions = ".ogg";
const audios = ["01", "02", "03", "04"];

const run = async () => {
  audios.forEach((audio) => {
    ffmpeg(`./audios/${audio}${extensions}`)
      .toFormat("mp3")
      .on("error", (err) => console.error("An error occurred: ", err))
      .on("end", () => console.info("Audio prompts done"))
      .save(`${audio}.mp3`);
  });

  await delay(250 * audios.length);

  audioconcat(audios.map((a) => `${a}.mp3`))
    .concat("./audios/all.mp3")
    .on("start", function (command) {
      console.log("ffmpeg process started:", command);
    })
    .on("error", function (err, stdout, stderr) {
      console.error("Error:", err);
      console.error("ffmpeg stderr:", stderr);
    })
    .on("end", function (output) {
      console.error("Audio created in:", output);
    });
  await delay(250 * audios.length);
  audios.forEach((audio) => {
    fs.unlink(`${audio}.mp3`, () => {});
  });
};

run();
