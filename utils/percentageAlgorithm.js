module.exports = (params) => {
  switch (params) {
    case "GLS":
      return {
        CPGE: "47",
        BUT: "18",
        BTS: "2",
        Licence: "30",
        "Ecole Post-Bac": "3",
      };
    case "GLN":
      return {
        CPGE: "7",
        BUT: "13",
        BTS: "3",
        Licence: "76",
        "Ecole Post-Bac": "1",
      };
    case "GCS":
      return {
        CPGE: "2",
        BUT: "33",
        BTS: "62",
        Licence: "1",
        "Ecole Post-Bac": "2",
      };
    case "GCN":
      return {
        CPGE: "4",
        BUT: "58",
        BTS: "32",
        Licence: "4",
        "Ecole Post-Bac": "2",
      };
    case "PLS":
      return {
        CPGE: "31",
        BUT: "11",
        BTS: "4",
        Licence: "13",
        "Ecole Post-Bac": "41",
      };
    case "PLN":
      return {
        CPGE: "4",
        BUT: "12",
        BTS: "11",
        Licence: "22",
        "Ecole Post-Bac": "51",
      };
    case "PCS":
      return {
        CPGE: "2",
        BUT: "3",
        BTS: "23",
        Licence: "13",
        "Ecole Post-Bac": "59",
      };
    case "PCN":
      return {
        CPGE: "2",
        BUT: "16",
        BTS: "58",
        Licence: "3",
        "Ecole Post-Bac": "21",
      };
    default:
      return;
  }
};
