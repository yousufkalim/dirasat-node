module.exports = (params) => {
  if (params === "GLS") {
    return {
      CPGE: "47",
      BUT: "18",
      BTS: "2",
      Licence: "30",
      "Ecole Post-Bac": "3",
    };
  } else if (params === "GLN") {
    return {
      CPGE: "7",
      BUT: "13",
      BTS: "3",
      Licence: "76",
      "Ecole Post-Bac": "1",
    };
  } else if (params === "GCS") {
    return {
      CPGE: "2",
      BUT: "33",
      BTS: "62",
      Licence: "1",
      "Ecole Post-Bac": "2",
    };
  } else if (params === "GCN") {
    return {
      CPGE: "4",
      BUT: "58",
      BTS: "32",
      Licence: "4",
      "Ecole Post-Bac": "2",
    };
  } else if (params === "PLS") {
    return {
      CPGE: "31",
      BUT: "11",
      BTS: "4",
      Licence: "13",
      "Ecole Post-Bac": "41",
    };
  } else if (params === "PLN") {
    return {
      CPGE: "4",
      BUT: "12",
      BTS: "11",
      Licence: "22",
      "Ecole Post-Bac": "51",
    };
  } else if (params === "PCS") {
    return {
      CPGE: "2",
      BUT: "3",
      BTS: "23",
      Licence: "13",
      "Ecole Post-Bac": "59",
    };
  } else if (params === "PCN") {
    return {
      CPGE: "2",
      BUT: "16",
      BTS: "58",
      Licence: "3",
      "Ecole Post-Bac": "21",
    };
  }
};
