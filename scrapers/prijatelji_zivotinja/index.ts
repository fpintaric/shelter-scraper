import jsdom from "jsdom";
import { AnimalInfo } from "../../types";

const { JSDOM } = jsdom;

const SHELTER_ID = "prijatelji-zivotinja.org";

const TEST_PAGE =
  "https://www.prijatelji-zivotinja.org/hr/udomi-psa/udomite-prijatelja?page=1";

const getHtmlResponse = async (pageUrl: string) => {
  const response = await fetch(pageUrl);
  const textResponse = await response.text();
  return textResponse;
};

const getAnimalCards = (html: string) => {
  const dom = new JSDOM(html);

  const animalCards = dom.window.document.querySelectorAll(
    ".thumbnail-boxed.thumbnail-boxed-vertical"
  );
  return animalCards;
};

const parseAnimalCards = (cards: NodeListOf<Element>): AnimalInfo[] => {
  const animals = Array.from(cards.values());
  return animals.map((animal) => {
    const name = animal.querySelector(".thumbnail-boxed-title > a").innerHTML;
    const ageAndSex = animal.querySelector(".thumbnail-boxed-meta");
    const age = ageAndSex
      .querySelector("li:first-child > span:last-child")
      .textContent.trim();
    const sex = ageAndSex.querySelector("li:last-child > span").innerHTML;
    const sexTrimmed = sex
      .replace(/\r?\n|\r/g, "")
      .trim()
      .split(" ");
    const image = animal
      .querySelector(".thumbnail-boxed-image")
      .getAttribute("src");
    return {
      name,
      shelterId: SHELTER_ID,
      age,
      sex: sexTrimmed[1],
      image,
    };
  });
};

const html = await getHtmlResponse(TEST_PAGE);
const animalCards = getAnimalCards(html);
const parsedAnimals = parseAnimalCards(animalCards);

console.log(parsedAnimals);

export {};
