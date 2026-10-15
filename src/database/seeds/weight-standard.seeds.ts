import { DataSource } from "typeorm";

import { WeightStandardEntity } from "@/modules/farmora/weight-standard/entities/weight-standard.entity";

export async function seedWeightStandard(dataSource: DataSource): Promise<void> {
    const weightStandardRepository = dataSource.getRepository(WeightStandardEntity);

    const weightStandards = weightStandardRepository.create([
        {
            uid: "wst-glc-01",
            breedUID: "brd-glc",
            week: 1,
            minWeight: 59,
            targetWeight: 65,
            maxWeight: 72,
        },
        {
            uid: "wst-glc-02",
            breedUID: "brd-glc",
            week: 2,
            minWeight: 105,
            targetWeight: 110,
            maxWeight: 115,
        },
        {
            uid: "wst-glc-03",
            breedUID: "brd-glc",
            week: 3,
            minWeight: 185,
            targetWeight: 190,
            maxWeight: 195,
        },
        {
            uid: "wst-glc-04",
            breedUID: "brd-glc",
            week: 4,
            minWeight: 270,
            targetWeight: 277.5,
            maxWeight: 285,
        },
        {
            uid: "wst-glc-05",
            breedUID: "brd-glc",
            week: 5,
            minWeight: 365,
            targetWeight: 375,
            maxWeight: 385,
        },
        {
            uid: "wst-glc-06",
            breedUID: "brd-glc",
            week: 6,
            minWeight: 460,
            targetWeight: 472.5,
            maxWeight: 485,
        },
        {
            uid: "wst-glc-07",
            breedUID: "brd-glc",
            week: 7,
            minWeight: 500,
            targetWeight: 555,
            maxWeight: 611,
        },
        {
            uid: "wst-glc-08",
            breedUID: "brd-glc",
            week: 8,
            minWeight: 640,
            targetWeight: 655,
            maxWeight: 670,
        },
        {
            uid: "wst-glc-09",
            breedUID: "brd-glc",
            week: 9,
            minWeight: 725,
            targetWeight: 745,
            maxWeight: 765,
        },
        {
            uid: "wst-glc-10",
            breedUID: "brd-glc",
            week: 10,
            minWeight: 810,
            targetWeight: 840,
            maxWeight: 870,
        },
        {
            uid: "wst-glc-11",
            breedUID: "brd-glc",
            week: 11,
            minWeight: 900,
            targetWeight: 927.5,
            maxWeight: 955,
        },
        {
            uid: "wst-glc-12",
            breedUID: "brd-glc",
            week: 12,
            minWeight: 985,
            targetWeight: 1020,
            maxWeight: 1055,
        },
        {
            uid: "wst-glc-13",
            breedUID: "brd-glc",
            week: 13,
            minWeight: 981,
            targetWeight: 1090,
            maxWeight: 1199,
        },
        {
            uid: "wst-glc-14",
            breedUID: "brd-glc",
            week: 14,
            minWeight: 1150,
            targetWeight: 1182.5,
            maxWeight: 1215,
        },
        {
            uid: "wst-glc-15",
            breedUID: "brd-glc",
            week: 15,
            minWeight: 1230,
            targetWeight: 1262.5,
            maxWeight: 1295,
        },
        {
            uid: "wst-glc-16",
            breedUID: "brd-glc",
            week: 16,
            minWeight: 1305,
            targetWeight: 1342.5,
            maxWeight: 1380,
        },
        {
            uid: "wst-glc-17",
            breedUID: "brd-glc",
            week: 17,
            minWeight: 1233,
            targetWeight: 1370,
            maxWeight: 1507,
        },
        {
            uid: "wst-glc-18",
            breedUID: "brd-glc",
            week: 18,
            minWeight: 1450,
            targetWeight: 1490,
            maxWeight: 1530,
        },

        {
            uid: "wst-bkb-01",
            breedUID: "brd-bkb",
            week: 1,
            minWeight: 56,
            targetWeight: 62,
            maxWeight: 68,
        },
        {
            uid: "wst-bkb-02",
            breedUID: "brd-bkb",
            week: 2,
            minWeight: 125,
            targetWeight: 128.5,
            maxWeight: 132,
        },
        {
            uid: "wst-bkb-03",
            breedUID: "brd-bkb",
            week: 3,
            minWeight: 194,
            targetWeight: 199,
            maxWeight: 204,
        },
        {
            uid: "wst-bkb-04",
            breedUID: "brd-bkb",
            week: 4,
            minWeight: 266,
            targetWeight: 273,
            maxWeight: 280,
        },
        {
            uid: "wst-bkb-05",
            breedUID: "brd-bkb",
            week: 5,
            minWeight: 341,
            targetWeight: 350,
            maxWeight: 359,
        },
        {
            uid: "wst-bkb-06",
            breedUID: "brd-bkb",
            week: 6,
            minWeight: 419,
            targetWeight: 429.5,
            maxWeight: 440,
        },
        {
            uid: "wst-bkb-07",
            breedUID: "brd-bkb",
            week: 7,
            minWeight: 444,
            targetWeight: 493,
            maxWeight: 542,
        },
        {
            uid: "wst-bkb-08",
            breedUID: "brd-bkb",
            week: 8,
            minWeight: 579,
            targetWeight: 594,
            maxWeight: 609,
        },
        {
            uid: "wst-bkb-09",
            breedUID: "brd-bkb",
            week: 9,
            minWeight: 660,
            targetWeight: 677,
            maxWeight: 694,
        },
        {
            uid: "wst-bkb-10",
            breedUID: "brd-bkb",
            week: 10,
            minWeight: 735,
            targetWeight: 752.5,
            maxWeight: 770,
        },
        {
            uid: "wst-bkb-11",
            breedUID: "brd-bkb",
            week: 11,
            minWeight: 820,
            targetWeight: 837.5,
            maxWeight: 855,
        },
        {
            uid: "wst-bkb-12",
            breedUID: "brd-bkb",
            week: 12,
            minWeight: 905,
            targetWeight: 922.5,
            maxWeight: 940,
        },
        {
            uid: "wst-bkb-13",
            breedUID: "brd-bkb",
            week: 13,
            minWeight: 871,
            targetWeight: 968,
            maxWeight: 1065,
        },
        {
            uid: "wst-bkb-14",
            breedUID: "brd-bkb",
            week: 14,
            minWeight: 1060,
            targetWeight: 1077.5,
            maxWeight: 1095,
        },
        {
            uid: "wst-bkb-15",
            breedUID: "brd-bkb",
            week: 15,
            minWeight: 1130,
            targetWeight: 1147.5,
            maxWeight: 1165,
        },
        {
            uid: "wst-bkb-16",
            breedUID: "brd-bkb",
            week: 16,
            minWeight: 1190,
            targetWeight: 1207.5,
            maxWeight: 1225,
        },
        {
            uid: "wst-bkb-17",
            breedUID: "brd-bkb",
            week: 17,
            minWeight: 1120,
            targetWeight: 1244,
            maxWeight: 1368,
        },
        {
            uid: "wst-bkb-18",
            breedUID: "brd-bkb",
            week: 18,
            minWeight: 1243,
            targetWeight: 1275,
            maxWeight: 1307,
        },

        {
            uid: "wst-novogen-color-blue-01",

            breedUID: "brd-novogen-color-blue",

            week: 1,

            minWeight: 62,

            targetWeight: 65,

            maxWeight: 68,
        },

        {
            uid: "wst-novogen-color-blue-02",

            breedUID: "brd-novogen-color-blue",

            week: 2,

            minWeight: 115,

            targetWeight: 120,

            maxWeight: 125,
        },

        {
            uid: "wst-novogen-color-blue-03",

            breedUID: "brd-novogen-color-blue",

            week: 3,

            minWeight: 190,

            targetWeight: 195,

            maxWeight: 200,
        },

        {
            uid: "wst-novogen-color-blue-04",

            breedUID: "brd-novogen-color-blue",

            week: 4,

            minWeight: 270,

            targetWeight: 277.5,

            maxWeight: 285,
        },

        {
            uid: "wst-novogen-color-blue-05",

            breedUID: "brd-novogen-color-blue",

            week: 5,

            minWeight: 365,

            targetWeight: 375,

            maxWeight: 385,
        },

        {
            uid: "wst-novogen-color-blue-06",

            breedUID: "brd-novogen-color-blue",

            week: 6,

            minWeight: 455,

            targetWeight: 467.5,

            maxWeight: 480,
        },

        {
            uid: "wst-novogen-color-blue-07",

            breedUID: "brd-novogen-color-blue",

            week: 7,

            minWeight: 545,

            targetWeight: 557.5,

            maxWeight: 570,
        },

        {
            uid: "wst-novogen-color-blue-08",

            breedUID: "brd-novogen-color-blue",

            week: 8,

            minWeight: 630,

            targetWeight: 645,

            maxWeight: 660,
        },

        {
            uid: "wst-novogen-color-blue-09",

            breedUID: "brd-novogen-color-blue",

            week: 9,

            minWeight: 710,

            targetWeight: 730,

            maxWeight: 750,
        },

        {
            uid: "wst-novogen-color-blue-10",

            breedUID: "brd-novogen-color-blue",

            week: 10,

            minWeight: 795,

            targetWeight: 817.5,

            maxWeight: 840,
        },

        {
            uid: "wst-novogen-color-blue-11",

            breedUID: "brd-novogen-color-blue",

            week: 11,

            minWeight: 880,

            targetWeight: 902.5,

            maxWeight: 925,
        },

        {
            uid: "wst-novogen-color-blue-12",

            breedUID: "brd-novogen-color-blue",

            week: 12,

            minWeight: 965,

            targetWeight: 990,

            maxWeight: 1015,
        },

        {
            uid: "wst-novogen-color-blue-13",

            breedUID: "brd-novogen-color-blue",

            week: 13,

            minWeight: 1050,

            targetWeight: 1077.5,

            maxWeight: 1105,
        },

        {
            uid: "wst-novogen-color-blue-14",

            breedUID: "brd-novogen-color-blue",

            week: 14,

            minWeight: 1135,

            targetWeight: 1162.5,

            maxWeight: 1190,
        },

        {
            uid: "wst-novogen-color-blue-15",

            breedUID: "brd-novogen-color-blue",

            week: 15,

            minWeight: 1215,

            targetWeight: 1245,

            maxWeight: 1275,
        },

        {
            uid: "wst-novogen-color-blue-16",

            breedUID: "brd-novogen-color-blue",

            week: 16,

            minWeight: 1295,

            targetWeight: 1327.5,

            maxWeight: 1360,
        },

        {
            uid: "wst-novogen-color-blue-17",

            breedUID: "brd-novogen-color-blue",

            week: 17,

            minWeight: 1380,

            targetWeight: 1415,

            maxWeight: 1450,
        },

        {
            uid: "wst-novogen-color-blue-18",

            breedUID: "brd-novogen-color-blue",

            week: 18,

            minWeight: 1455,

            targetWeight: 1490,

            maxWeight: 1525,
        },

        {
            uid: "wst-novogen-color-green-01",

            breedUID: "brd-novogen-color-green",

            week: 1,

            minWeight: 62,

            targetWeight: 65,

            maxWeight: 68,
        },

        {
            uid: "wst-novogen-color-green-02",

            breedUID: "brd-novogen-color-green",

            week: 2,

            minWeight: 115,

            targetWeight: 120,

            maxWeight: 125,
        },

        {
            uid: "wst-novogen-color-green-03",

            breedUID: "brd-novogen-color-green",

            week: 3,

            minWeight: 190,

            targetWeight: 195,

            maxWeight: 200,
        },

        {
            uid: "wst-novogen-color-green-04",

            breedUID: "brd-novogen-color-green",

            week: 4,

            minWeight: 270,

            targetWeight: 277.5,

            maxWeight: 285,
        },

        {
            uid: "wst-novogen-color-green-05",

            breedUID: "brd-novogen-color-green",

            week: 5,

            minWeight: 365,

            targetWeight: 375,

            maxWeight: 385,
        },

        {
            uid: "wst-novogen-color-green-06",

            breedUID: "brd-novogen-color-green",

            week: 6,

            minWeight: 455,

            targetWeight: 467.5,

            maxWeight: 480,
        },

        {
            uid: "wst-novogen-color-green-07",

            breedUID: "brd-novogen-color-green",

            week: 7,

            minWeight: 545,

            targetWeight: 557.5,

            maxWeight: 570,
        },

        {
            uid: "wst-novogen-color-green-08",

            breedUID: "brd-novogen-color-green",

            week: 8,

            minWeight: 630,

            targetWeight: 645,

            maxWeight: 660,
        },

        {
            uid: "wst-novogen-color-green-09",

            breedUID: "brd-novogen-color-green",

            week: 9,

            minWeight: 710,

            targetWeight: 730,

            maxWeight: 750,
        },

        {
            uid: "wst-novogen-color-green-10",

            breedUID: "brd-novogen-color-green",

            week: 10,

            minWeight: 795,

            targetWeight: 817.5,

            maxWeight: 840,
        },

        {
            uid: "wst-novogen-color-green-11",

            breedUID: "brd-novogen-color-green",

            week: 11,

            minWeight: 880,

            targetWeight: 902.5,

            maxWeight: 925,
        },

        {
            uid: "wst-novogen-color-green-12",

            breedUID: "brd-novogen-color-green",

            week: 12,

            minWeight: 965,

            targetWeight: 990,

            maxWeight: 1015,
        },

        {
            uid: "wst-novogen-color-green-13",

            breedUID: "brd-novogen-color-green",

            week: 13,

            minWeight: 1050,

            targetWeight: 1077.5,

            maxWeight: 1105,
        },

        {
            uid: "wst-novogen-color-green-14",

            breedUID: "brd-novogen-color-green",

            week: 14,

            minWeight: 1135,

            targetWeight: 1162.5,

            maxWeight: 1190,
        },

        {
            uid: "wst-novogen-color-green-15",

            breedUID: "brd-novogen-color-green",

            week: 15,

            minWeight: 1215,

            targetWeight: 1245,

            maxWeight: 1275,
        },

        {
            uid: "wst-novogen-color-green-16",

            breedUID: "brd-novogen-color-green",

            week: 16,

            minWeight: 1295,

            targetWeight: 1327.5,

            maxWeight: 1360,
        },

        {
            uid: "wst-novogen-color-green-17",

            breedUID: "brd-novogen-color-green",

            week: 17,

            minWeight: 1380,

            targetWeight: 1415,

            maxWeight: 1450,
        },

        {
            uid: "wst-novogen-color-green-18",

            breedUID: "brd-novogen-color-green",

            week: 18,

            minWeight: 1455,

            targetWeight: 1490,

            maxWeight: 1525,
        },

        {
            uid: "wst_isa-brown-01",

            breedUID: "brd-isa-brown",

            week: 1,

            minWeight: 64,

            targetWeight: 65.5,

            maxWeight: 67,
        },

        {
            uid: "wst_isa-brown-02",

            breedUID: "brd-isa-brown",

            week: 2,

            minWeight: 132,

            targetWeight: 135.5,

            maxWeight: 139,
        },

        {
            uid: "wst_isa-brown-03",

            breedUID: "brd-isa-brown",

            week: 3,

            minWeight: 211,

            targetWeight: 216,

            maxWeight: 221,
        },

        {
            uid: "wst_isa-brown-04",

            breedUID: "brd-isa-brown",

            week: 4,

            minWeight: 296,

            targetWeight: 304,

            maxWeight: 312,
        },

        {
            uid: "wst_isa-brown-05",

            breedUID: "brd-isa-brown",

            week: 5,

            minWeight: 388,

            targetWeight: 398,

            maxWeight: 408,
        },

        {
            uid: "wst_isa-brown-06",

            breedUID: "brd-isa-brown",

            week: 6,

            minWeight: 485,

            targetWeight: 497.5,

            maxWeight: 510,
        },

        {
            uid: "wst_isa-brown-07",

            breedUID: "brd-isa-brown",

            week: 7,

            minWeight: 584,

            targetWeight: 599,

            maxWeight: 614,
        },

        {
            uid: "wst_isa-brown-08",

            breedUID: "brd-isa-brown",

            week: 8,

            minWeight: 685,

            targetWeight: 702.5,

            maxWeight: 720,
        },

        {
            uid: "wst_isa-brown-09",

            breedUID: "brd-isa-brown",

            week: 9,

            minWeight: 786,

            targetWeight: 806,

            maxWeight: 826,
        },

        {
            uid: "wst_isa-brown-10",

            breedUID: "brd-isa-brown",

            week: 10,

            minWeight: 886,

            targetWeight: 909,

            maxWeight: 932,
        },

        {
            uid: "wst_isa-brown-11",

            breedUID: "brd-isa-brown",

            week: 11,

            minWeight: 984,

            targetWeight: 1009,

            maxWeight: 1034,
        },

        {
            uid: "wst_isa-brown-12",

            breedUID: "brd-isa-brown",

            week: 12,

            minWeight: 1079,

            targetWeight: 1106.5,

            maxWeight: 1134,
        },

        {
            uid: "wst_isa-brown-13",

            breedUID: "brd-isa-brown",

            week: 13,

            minWeight: 1169,

            targetWeight: 1199,

            maxWeight: 1229,
        },

        {
            uid: "wst_isa-brown-14",

            breedUID: "brd-isa-brown",

            week: 14,

            minWeight: 1255,

            targetWeight: 1287,

            maxWeight: 1319,
        },

        {
            uid: "wst_isa-brown-15",

            breedUID: "brd-isa-brown",

            week: 15,

            minWeight: 1335,

            targetWeight: 1369.5,

            maxWeight: 1404,
        },

        {
            uid: "wst_isa-brown-16",

            breedUID: "brd-isa-brown",

            week: 16,

            minWeight: 1409,

            targetWeight: 1445,

            maxWeight: 1481,
        },

        {
            uid: "wst_isa-brown-17",

            breedUID: "brd-isa-brown",

            week: 17,

            minWeight: 1476,

            targetWeight: 1514,

            maxWeight: 1552,
        },

        {
            uid: "wst_isa-brown-18",

            breedUID: "brd-isa-brown",

            week: 18,

            minWeight: 1537,

            targetWeight: 1576,

            maxWeight: 1615,
        },

        {
            uid: "wst-novogen-tinted-01",

            breedUID: "brd-novogen-tinted",

            week: 1,

            minWeight: 63,

            targetWeight: 65.5,

            maxWeight: 68,
        },

        {
            uid: "wst-novogen-tinted-02",

            breedUID: "brd-novogen-tinted",

            week: 2,

            minWeight: 105,

            targetWeight: 110,

            maxWeight: 115,
        },

        {
            uid: "wst-novogen-tinted-03",

            breedUID: "brd-novogen-tinted",

            week: 3,

            minWeight: 185,

            targetWeight: 190,

            maxWeight: 195,
        },

        {
            uid: "wst-novogen-tinted-04",

            breedUID: "brd-novogen-tinted",

            week: 4,

            minWeight: 270,

            targetWeight: 277.5,

            maxWeight: 285,
        },

        {
            uid: "wst-novogen-tinted-05",

            breedUID: "brd-novogen-tinted",

            week: 5,

            minWeight: 365,

            targetWeight: 375,

            maxWeight: 385,
        },

        {
            uid: "wst-novogen-tinted-06",

            breedUID: "brd-novogen-tinted",

            week: 6,

            minWeight: 460,

            targetWeight: 472.5,

            maxWeight: 485,
        },

        {
            uid: "wst-novogen-tinted-07",

            breedUID: "brd-novogen-tinted",

            week: 7,

            minWeight: 550,

            targetWeight: 565,

            maxWeight: 580,
        },

        {
            uid: "wst-novogen-tinted-08",

            breedUID: "brd-novogen-tinted",

            week: 8,

            minWeight: 640,

            targetWeight: 655,

            maxWeight: 670,
        },

        {
            uid: "wst-novogen-tinted-09",

            breedUID: "brd-novogen-tinted",

            week: 9,

            minWeight: 725,

            targetWeight: 745,

            maxWeight: 765,
        },

        {
            uid: "wst-novogen-tinted-10",

            breedUID: "brd-novogen-tinted",

            week: 10,

            minWeight: 810,

            targetWeight: 840,

            maxWeight: 870,
        },

        {
            uid: "wst-novogen-tinted-11",

            breedUID: "brd-novogen-tinted",

            week: 11,

            minWeight: 900,

            targetWeight: 927.5,

            maxWeight: 955,
        },

        {
            uid: "wst-novogen-tinted-12",

            breedUID: "brd-novogen-tinted",

            week: 12,

            minWeight: 985,

            targetWeight: 1020,

            maxWeight: 1055,
        },

        {
            uid: "wst-novogen-tinted-13",

            breedUID: "brd-novogen-tinted",

            week: 13,

            minWeight: 1075,

            targetWeight: 1107.5,

            maxWeight: 1140,
        },

        {
            uid: "wst-novogen-tinted-14",

            breedUID: "brd-novogen-tinted",

            week: 14,

            minWeight: 1150,

            targetWeight: 1182.5,

            maxWeight: 1215,
        },

        {
            uid: "wst-novogen-tinted-15",

            breedUID: "brd-novogen-tinted",

            week: 15,

            minWeight: 1230,

            targetWeight: 1262.5,

            maxWeight: 1295,
        },

        {
            uid: "wst-novogen-tinted-16",

            breedUID: "brd-novogen-tinted",

            week: 16,

            minWeight: 1305,

            targetWeight: 1342.5,

            maxWeight: 1380,
        },

        {
            uid: "wst-novogen-tinted-17",

            breedUID: "brd-novogen-tinted",

            week: 17,

            minWeight: 1380,

            targetWeight: 1420,

            maxWeight: 1460,
        },

        {
            uid: "wst-novogen-tinted-18",

            breedUID: "brd-novogen-tinted",

            week: 18,

            minWeight: 1450,

            targetWeight: 1490,

            maxWeight: 1530,
        },

        {
            uid: "wst-novogen-brown-01",

            breedUID: "brd-novogen-brown",

            week: 1,

            minWeight: 65,

            targetWeight: 67.5,

            maxWeight: 70,
        },

        {
            uid: "wst-novogen-brown-02",

            breedUID: "brd-novogen-brown",

            week: 2,

            minWeight: 110,

            targetWeight: 115,

            maxWeight: 120,
        },

        {
            uid: "wst-novogen-brown-03",

            breedUID: "brd-novogen-brown",

            week: 3,

            minWeight: 180,

            targetWeight: 185,

            maxWeight: 190,
        },

        {
            uid: "wst-novogen-brown-04",

            breedUID: "brd-novogen-brown",

            week: 4,

            minWeight: 270,

            targetWeight: 277.5,

            maxWeight: 285,
        },

        {
            uid: "wst-novogen-brown-05",

            breedUID: "brd-novogen-brown",

            week: 5,

            minWeight: 360,

            targetWeight: 372.5,

            maxWeight: 385,
        },

        {
            uid: "wst-novogen-brown-06",

            breedUID: "brd-novogen-brown",

            week: 6,

            minWeight: 470,

            targetWeight: 482.5,

            maxWeight: 495,
        },

        {
            uid: "wst-novogen-brown-07",

            breedUID: "brd-novogen-brown",

            week: 7,

            minWeight: 570,

            targetWeight: 585,

            maxWeight: 600,
        },

        {
            uid: "wst-novogen-brown-08",

            breedUID: "brd-novogen-brown",

            week: 8,

            minWeight: 660,

            targetWeight: 677.5,

            maxWeight: 695,
        },

        {
            uid: "wst-novogen-brown-09",

            breedUID: "brd-novogen-brown",

            week: 9,

            minWeight: 750,

            targetWeight: 770,

            maxWeight: 790,
        },

        {
            uid: "wst-novogen-brown-10",

            breedUID: "brd-novogen-brown",

            week: 10,

            minWeight: 840,

            targetWeight: 870,

            maxWeight: 900,
        },

        {
            uid: "wst-novogen-brown-11",

            breedUID: "brd-novogen-brown",

            week: 11,

            minWeight: 930,

            targetWeight: 960,

            maxWeight: 990,
        },

        {
            uid: "wst-novogen-brown-12",

            breedUID: "brd-novogen-brown",

            week: 12,

            minWeight: 1020,

            targetWeight: 1055,

            maxWeight: 1090,
        },

        {
            uid: "wst-novogen-brown-13",

            breedUID: "brd-novogen-brown",

            week: 13,

            minWeight: 1110,

            targetWeight: 1145,

            maxWeight: 1180,
        },

        {
            uid: "wst-novogen-brown-14",

            breedUID: "brd-novogen-brown",

            week: 14,

            minWeight: 1190,

            targetWeight: 1222.5,

            maxWeight: 1255,
        },

        {
            uid: "wst-novogen-brown-15",

            breedUID: "brd-novogen-brown",

            week: 15,

            minWeight: 1270,

            targetWeight: 1305,

            maxWeight: 1340,
        },

        {
            uid: "wst-novogen-brown-16",

            breedUID: "brd-novogen-brown",

            week: 16,

            minWeight: 1350,

            targetWeight: 1387.5,

            maxWeight: 1425,
        },

        {
            uid: "wst-novogen-brown-17",

            breedUID: "brd-novogen-brown",

            week: 17,

            minWeight: 1430,

            targetWeight: 1470,

            maxWeight: 1510,
        },

        {
            uid: "wst-novogen-brown-18",

            breedUID: "brd-novogen-brown",

            week: 18,

            minWeight: 1500,

            targetWeight: 1540,

            maxWeight: 1580,
        },

        {
            uid: "wst-novogen-white-01",

            breedUID: "brd-novogen-white",

            week: 1,

            minWeight: 70,

            targetWeight: 72.5,

            maxWeight: 75,
        },

        {
            uid: "wst-novogen-white-02",

            breedUID: "brd-novogen-white",

            week: 2,

            minWeight: 125,

            targetWeight: 127.5,

            maxWeight: 130,
        },

        {
            uid: "wst-novogen-white-03",

            breedUID: "brd-novogen-white",

            week: 3,

            minWeight: 190,

            targetWeight: 195,

            maxWeight: 200,
        },

        {
            uid: "wst-novogen-white-04",

            breedUID: "brd-novogen-white",

            week: 4,

            minWeight: 270,

            targetWeight: 277.5,

            maxWeight: 285,
        },

        {
            uid: "wst-novogen-white-05",

            breedUID: "brd-novogen-white",

            week: 5,

            minWeight: 345,

            targetWeight: 355,

            maxWeight: 365,
        },

        {
            uid: "wst-novogen-white-06",

            breedUID: "brd-novogen-white",

            week: 6,

            minWeight: 425,

            targetWeight: 437.5,

            maxWeight: 450,
        },

        {
            uid: "wst-novogen-white-07",

            breedUID: "brd-novogen-white",

            week: 7,

            minWeight: 500,

            targetWeight: 515,

            maxWeight: 530,
        },

        {
            uid: "wst-novogen-white-08",

            breedUID: "brd-novogen-white",

            week: 8,

            minWeight: 575,

            targetWeight: 590,

            maxWeight: 605,
        },

        {
            uid: "wst-novogen-white-09",

            breedUID: "brd-novogen-white",

            week: 9,

            minWeight: 650,

            targetWeight: 667.5,

            maxWeight: 685,
        },

        {
            uid: "wst-novogen-white-10",

            breedUID: "brd-novogen-white",

            week: 10,

            minWeight: 720,

            targetWeight: 740,

            maxWeight: 760,
        },

        {
            uid: "wst-novogen-white-11",

            breedUID: "brd-novogen-white",

            week: 11,

            minWeight: 790,

            targetWeight: 812.5,

            maxWeight: 835,
        },

        {
            uid: "wst-novogen-white-12",

            breedUID: "brd-novogen-white",

            week: 12,

            minWeight: 855,

            targetWeight: 880,

            maxWeight: 905,
        },

        {
            uid: "wst-novogen-white-13",

            breedUID: "brd-novogen-white",

            week: 13,

            minWeight: 920,

            targetWeight: 945,

            maxWeight: 970,
        },

        {
            uid: "wst-novogen-white-14",

            breedUID: "brd-novogen-white",

            week: 14,

            minWeight: 980,

            targetWeight: 1007.5,

            maxWeight: 1035,
        },

        {
            uid: "wst-novogen-white-15",

            breedUID: "brd-novogen-white",

            week: 15,

            minWeight: 1045,

            targetWeight: 1075,

            maxWeight: 1105,
        },

        {
            uid: "wst-novogen-white-16",

            breedUID: "brd-novogen-white",

            week: 16,

            minWeight: 1110,

            targetWeight: 1140,

            maxWeight: 1170,
        },

        {
            uid: "wst-novogen-white-17",

            breedUID: "brd-novogen-white",

            week: 17,

            minWeight: 1170,

            targetWeight: 1202.5,

            maxWeight: 1235,
        },

        {
            uid: "wst-novogen-white-18",

            breedUID: "brd-novogen-white",

            week: 18,

            minWeight: 1230,

            targetWeight: 1265,

            maxWeight: 1300,
        },

        {
            uid: "wst-hyline-brown-max-01",

            breedUID: "brd-hyline-brown-max",

            week: 1,

            minWeight: 70,

            targetWeight: 73,

            maxWeight: 76,
        },

        {
            uid: "wst-hyline-brown-max-02",

            breedUID: "brd-hyline-brown-max",

            week: 2,

            minWeight: 127,

            targetWeight: 132,

            maxWeight: 138,
        },

        {
            uid: "wst-hyline-brown-max-03",

            breedUID: "brd-hyline-brown-max",

            week: 3,

            minWeight: 192,

            targetWeight: 200,

            maxWeight: 208,
        },

        {
            uid: "wst-hyline-brown-max-04",

            breedUID: "brd-hyline-brown-max",

            week: 4,

            minWeight: 267,

            targetWeight: 278,

            maxWeight: 289,
        },

        {
            uid: "wst-hyline-brown-max-05",

            breedUID: "brd-hyline-brown-max",

            week: 5,

            minWeight: 353,

            targetWeight: 368,

            maxWeight: 383,
        },

        {
            uid: "wst-hyline-brown-max-06",

            breedUID: "brd-hyline-brown-max",

            week: 6,

            minWeight: 447,

            targetWeight: 466,

            maxWeight: 485,
        },

        {
            uid: "wst-hyline-brown-max-07",

            breedUID: "brd-hyline-brown-max",

            week: 7,

            minWeight: 546,

            targetWeight: 569,

            maxWeight: 591,
        },

        {
            uid: "wst-hyline-brown-max-08",

            breedUID: "brd-hyline-brown-max",

            week: 8,

            minWeight: 646,

            targetWeight: 673,

            maxWeight: 700,
        },

        {
            uid: "wst-hyline-brown-max-09",

            breedUID: "brd-hyline-brown-max",

            week: 9,

            minWeight: 747,

            targetWeight: 778,

            maxWeight: 809,
        },

        {
            uid: "wst-hyline-brown-max-10",

            breedUID: "brd-hyline-brown-max",

            week: 10,

            minWeight: 845,

            targetWeight: 880,

            maxWeight: 916,
        },

        {
            uid: "wst-hyline-brown-max-11",

            breedUID: "brd-hyline-brown-max",

            week: 11,

            minWeight: 940,

            targetWeight: 979,

            maxWeight: 1018,
        },

        {
            uid: "wst-hyline-brown-max-12",

            breedUID: "brd-hyline-brown-max",

            week: 12,

            minWeight: 1029,

            targetWeight: 1072,

            maxWeight: 1114,
        },

        {
            uid: "wst-hyline-brown-max-13",

            breedUID: "brd-hyline-brown-max",

            week: 13,

            minWeight: 1111,

            targetWeight: 1157,

            maxWeight: 1203,
        },

        {
            uid: "wst-hyline-brown-max-14",

            breedUID: "brd-hyline-brown-max",

            week: 14,

            minWeight: 1186,

            targetWeight: 1236,

            maxWeight: 1285,
        },

        {
            uid: "wst-hyline-brown-max-15",

            breedUID: "brd-hyline-brown-max",

            week: 15,

            minWeight: 1257,

            targetWeight: 1310,

            maxWeight: 1362,
        },

        {
            uid: "wst-hyline-brown-max-16",

            breedUID: "brd-hyline-brown-max",

            week: 16,

            minWeight: 1326,

            targetWeight: 1381,

            maxWeight: 1437,
        },

        {
            uid: "wst-hyline-brown-max-17",

            breedUID: "brd-hyline-brown-max",

            week: 17,

            minWeight: 1393,

            targetWeight: 1451,

            maxWeight: 1509,
        },

        {
            uid: "wst-hyline-brown-max-18",

            breedUID: "brd-hyline-brown-max",

            week: 18,

            minWeight: 1460,

            targetWeight: 1515,

            maxWeight: 1570,
        },

        {
            uid: "wst-dekalb-white-01",

            breedUID: "brd-dekalb-white",

            week: 1,

            minWeight: 65,

            targetWeight: 67,

            maxWeight: 69,
        },

        {
            uid: "wst-dekalb-white-02",

            breedUID: "brd-dekalb-white",

            week: 2,

            minWeight: 125,

            targetWeight: 128.5,

            maxWeight: 132,
        },

        {
            uid: "wst-dekalb-white-03",

            breedUID: "brd-dekalb-white",

            week: 3,

            minWeight: 194,

            targetWeight: 199,

            maxWeight: 204,
        },

        {
            uid: "wst-dekalb-white-04",

            breedUID: "brd-dekalb-white",

            week: 4,

            minWeight: 266,

            targetWeight: 273,

            maxWeight: 280,
        },

        {
            uid: "wst-dekalb-white-05",

            breedUID: "brd-dekalb-white",

            week: 5,

            minWeight: 341,

            targetWeight: 350,

            maxWeight: 359,
        },

        {
            uid: "wst-dekalb-white-06",

            breedUID: "brd-dekalb-white",

            week: 6,

            minWeight: 419,

            targetWeight: 429.5,

            maxWeight: 440,
        },

        {
            uid: "wst-dekalb-white-07",

            breedUID: "brd-dekalb-white",

            week: 7,

            minWeight: 498,

            targetWeight: 511,

            maxWeight: 524,
        },

        {
            uid: "wst-dekalb-white-08",

            breedUID: "brd-dekalb-white",

            week: 8,

            minWeight: 579,

            targetWeight: 594,

            maxWeight: 609,
        },

        {
            uid: "wst-dekalb-white-09",

            breedUID: "brd-dekalb-white",

            week: 9,

            minWeight: 660,

            targetWeight: 677,

            maxWeight: 694,
        },

        {
            uid: "wst-dekalb-white-10",

            breedUID: "brd-dekalb-white",

            week: 10,

            minWeight: 735,

            targetWeight: 752.5,

            maxWeight: 770,
        },

        {
            uid: "wst-dekalb-white-11",

            breedUID: "brd-dekalb-white",

            week: 11,

            minWeight: 820,

            targetWeight: 837.5,

            maxWeight: 855,
        },

        {
            uid: "wst-dekalb-white-12",

            breedUID: "brd-dekalb-white",

            week: 12,

            minWeight: 905,

            targetWeight: 922.5,

            maxWeight: 940,
        },

        {
            uid: "wst-dekalb-white-13",

            breedUID: "brd-dekalb-white",

            week: 13,

            minWeight: 980,

            targetWeight: 997.5,

            maxWeight: 1015,
        },

        {
            uid: "wst-dekalb-white-14",

            breedUID: "brd-dekalb-white",

            week: 14,

            minWeight: 1060,

            targetWeight: 1077.5,

            maxWeight: 1095,
        },

        {
            uid: "wst-dekalb-white-15",

            breedUID: "brd-dekalb-white",

            week: 15,

            minWeight: 1130,

            targetWeight: 1147.5,

            maxWeight: 1165,
        },

        {
            uid: "wst-dekalb-white-16",

            breedUID: "brd-dekalb-white",

            week: 16,

            minWeight: 1190,

            targetWeight: 1207.5,

            maxWeight: 1225,
        },

        {
            uid: "wst-dekalb-white-17",

            breedUID: "brd-dekalb-white",

            week: 17,

            minWeight: 1250,

            targetWeight: 1267.5,

            maxWeight: 1285,
        },

        {
            uid: "wst-dekalb-white-18",

            breedUID: "brd-dekalb-white",

            week: 18,

            minWeight: 1243,

            targetWeight: 1275,

            maxWeight: 1307,
        },

        {
            uid: "wst-lohmann-brown-classic-01",

            breedUID: "brd-lohmann-brown-classic",

            week: 1,

            minWeight: 73,

            targetWeight: 75,

            maxWeight: 77,
        },

        {
            uid: "wst-lohmann-brown-classic-02",

            breedUID: "brd-lohmann-brown-classic",

            week: 2,

            minWeight: 126,

            targetWeight: 130,

            maxWeight: 134,
        },

        {
            uid: "wst-lohmann-brown-classic-03",

            breedUID: "brd-lohmann-brown-classic",

            week: 3,

            minWeight: 189,

            targetWeight: 195,

            maxWeight: 201,
        },

        {
            uid: "wst-lohmann-brown-classic-04",

            breedUID: "brd-lohmann-brown-classic",

            week: 4,

            minWeight: 265,

            targetWeight: 273,

            maxWeight: 281,
        },

        {
            uid: "wst-lohmann-brown-classic-05",

            breedUID: "brd-lohmann-brown-classic",

            week: 5,

            minWeight: 355,

            targetWeight: 366,

            maxWeight: 377,
        },

        {
            uid: "wst-lohmann-brown-classic-06",

            breedUID: "brd-lohmann-brown-classic",

            week: 6,

            minWeight: 455,

            targetWeight: 469,

            maxWeight: 483,
        },

        {
            uid: "wst-lohmann-brown-classic-07",

            breedUID: "brd-lohmann-brown-classic",

            week: 7,

            minWeight: 556,

            targetWeight: 573,

            maxWeight: 590,
        },

        {
            uid: "wst-lohmann-brown-classic-08",

            breedUID: "brd-lohmann-brown-classic",

            week: 8,

            minWeight: 657,

            targetWeight: 677,

            maxWeight: 697,
        },

        {
            uid: "wst-lohmann-brown-classic-09",

            breedUID: "brd-lohmann-brown-classic",

            week: 9,

            minWeight: 754,

            targetWeight: 777,

            maxWeight: 800,
        },

        {
            uid: "wst-lohmann-brown-classic-10",

            breedUID: "brd-lohmann-brown-classic",

            week: 10,

            minWeight: 847,

            targetWeight: 873,

            maxWeight: 899,
        },

        {
            uid: "wst-lohmann-brown-classic-11",

            breedUID: "brd-lohmann-brown-classic",

            week: 11,

            minWeight: 934,

            targetWeight: 963,

            maxWeight: 992,
        },

        {
            uid: "wst-lohmann-brown-classic-12",

            breedUID: "brd-lohmann-brown-classic",

            week: 12,

            minWeight: 1016,

            targetWeight: 1047,

            maxWeight: 1078,
        },

        {
            uid: "wst-lohmann-brown-classic-13",

            breedUID: "brd-lohmann-brown-classic",

            week: 13,

            minWeight: 1094,

            targetWeight: 1128,

            maxWeight: 1162,
        },

        {
            uid: "wst-lohmann-brown-classic-14",

            breedUID: "brd-lohmann-brown-classic",

            week: 14,

            minWeight: 1169,

            targetWeight: 1205,

            maxWeight: 1241,
        },

        {
            uid: "wst-lohmann-brown-classic-15",

            breedUID: "brd-lohmann-brown-classic",

            week: 15,

            minWeight: 1241,

            targetWeight: 1279,

            maxWeight: 1317,
        },

        {
            uid: "wst-lohmann-brown-classic-16",

            breedUID: "brd-lohmann-brown-classic",

            week: 16,

            minWeight: 1310,

            targetWeight: 1351,

            maxWeight: 1392,
        },

        {
            uid: "wst-lohmann-brown-classic-17",

            breedUID: "brd-lohmann-brown-classic",

            week: 17,

            minWeight: 1378,

            targetWeight: 1421,

            maxWeight: 1464,
        },

        {
            uid: "wst-lohmann-brown-classic-18",

            breedUID: "brd-lohmann-brown-classic",

            week: 18,

            minWeight: 1448,

            targetWeight: 1493,

            maxWeight: 1538,
        },
    ]);

    await weightStandardRepository.upsert(weightStandards, ["uid"]);
}
