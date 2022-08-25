var data = {
  bioData: null,
  message: "Hello Vue!",
  name: { name: "defaultName", gender: "male" },
  currentLocation: "",
  locationEnabled: true,
  occupation: "",
  occupationEnabled: false,
  degree: "",
  school: "",
  schoolEnabled: true,
  desire: "",
  desireEnabled: true,
  religion: "",
  religionEnabled: true,
};
this.setupBio();
async function setupBio() {
  let response = await fetch("./data.json");
  console.log(response);
  this.bioData = await response.json();
  this.name = this.randomElement(this.bioData["names"]);
  //remove when gender neutrality is working
  if (this.name.gender == "neutral") {
    this.name.gender = "male";
  }
  this.currentLocation = this.randomElement(this.bioData["locations"]);
  this.occupation = this.randomElement(this.bioData["occupations"]);
  this.degree = this.randomElement(this.bioData["degrees"]);
  this.school = this.randomElement(this.bioData["schools"]);
  this.desire = this.randomElement(this.bioData["desires"]).description;
  this.religion = this.randomElement(
    this.bioData["religious-backgrounds"]
  ).description;
}
function randomElement(JSONarray) {
  let result = JSONarray[Math.floor(Math.random() * JSONarray.length)];
  return result;
}
//select all elements of intensity 0-3: randomElement(array, 'intensity', 4, '<')
function randomElementWithCriteria(
  JSONarray,
  filterField,
  criteria,
  comparator
) {
  let filteredArray = [];
  if (comparator == "<") {
    filteredArray = JSONarray.filter((element) => {
      return element[filterField] < criteria;
    });
  } else if (comparator == ">") {
    filteredArray = JSONarray.filter((element) => {
      return element[filterField] > criteria;
    });
  } else if (comparator == "=") {
    filteredArray = JSONarray.filter((element) => {
      return element[filterField] == criteria;
    });
  } else {
    console.log("invalid randomElement comparator, must be '<', '>', or '='");
    return [];
  }
  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}
function randomizeName() {
  this.name = this.randomElement(this.bioData["names"]);
  //remove this once gender neutrality is working
  if (this.name.gender == "neutral") {
    this.name.gender = "male";
  }
}
function processStringVariables(string) {
  //parse the entire string and replace the variables from the json array with the real pronouns
  string = string.replace(/\[SubjectPronoun\]/g, this.pronounSubject);
  string = string.replace(/\[PossessivePronoun\]/g, this.pronounPossessive);
  string = string.replace(/\[ObjectPronoun\]/g, this.pronounObject);
  string = string.replace(/\[Name\]/g, this.name.name);
  string = string.replace(/\[Partner\]/g, this.partner);
  string = string.replace(/\[Spouse\]/g, this.spouse);
  //capitalize all subjects at beginning of sentences
  let reg = new RegExp("\\. " + this.pronounSubject, "g");
  let replacement =
    ". " +
    this.pronounSubject.charAt(0).toUpperCase() +
    this.pronounSubject.slice(1);
  string = string.replace(reg, replacement);
  return string;
}
function bio() {
  let string = "";
  //location
  if (this.locationEnabled)
    string +=
      this.name.name +
      " " +
      this.presentBe +
      " from " +
      this.currentLocation +
      ". ";
  else {
    string += "You are teaching " + this.name.name + ". ";
  }

  //school
  if (this.schoolEnabled) {
    string +=
      this.pronounSubject +
      " " +
      this.presentBe +
      " studying " +
      this.degree +
      " at " +
      this.school +
      ". ";
  }

  //occupation
  if (this.occupationEnabled) {
    string +=
      this.pronounSubject + " currently works as a " + this.occupation + ". ";
  }

  //religious background
  if (this.religionEnabled) {
    string +=
      this.pronounSubject +
      " " +
      this.pastBe +
      " raised " +
      this.religion +
      ". ";
  }

  if (this.desireEnabled) {
    string += this.pronounSubject + " " + this.desire + ".";
  }

  return this.processStringVariables(string);
}
function presentBe() {
  return "is";
}
function pastBe() {
  return "was";
}
function pronounSubject() {
  if (this.name.gender == "male") return "he";
  else return "she";
}
function pronounObject() {
  if (this.name.gender == "male") return "him";
  else return "her";
}
function pronounPossessive() {
  if (this.name.gender == "male") return "his";
  else return "her";
}
function partner() {
  if (this.name.gender == "male") return "girlfriend";
  else return "boyfriend";
}
function spouse() {
  if (this.name.gender == "male") return "wife";
  else return "husband";
}
