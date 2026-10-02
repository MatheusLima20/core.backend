import { DataSource } from "typeorm";

import { BreedEntity } from "@/modules/farmora/flock/breed/entities/breed.entity";
import { BreedPurpose } from "@/modules/farmora/flock/breed/enums/breed-origin.enum";
import { EggColor } from "@/modules/farmora/flock/breed/enums/egg-color.enum";

export async function seedBreed(dataSource: DataSource): Promise<void> {
    const breedRepository = dataSource.getRepository(BreedEntity);

    const breeds = breedRepository.create([
        // ============================================================
        // GLC
        // ============================================================

        {
            uid: "brd-glc",
            name: "GLC",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description: "Linhagem avícola utilizada em sistemas de produção de ovos e carne.",
            urlImage:
                "https://http2.mlstatic.com/D_NQ_NP_913899-MLB50785107163_072022-O-ovos-galados-galinhas-glc--original.webp",
        },

        // ============================================================
        // BKB
        // ============================================================

        {
            uid: "brd-bkb",
            name: "BKB",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description: "Linhagem avícola utilizada em sistemas de produção de ovos e carne.",
            urlImage: "https://http2.mlstatic.com/D_Q_NP_2X_644280-MLB76314965823_052024-P.webp",
        },

        // ============================================================
        // NOVOgen COLOR BLUE
        // ============================================================

        {
            uid: "brd-novogen-color-blue",
            name: "NOVOgen Color Blue",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BLUE,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description:
                "Linhagem NOVOGEN COLOR selecionada para rusticidade, adaptação a diferentes sistemas de produção e produção de ovos de casca azul.",
            urlImage: "https://novogen-layers.com/wp-content/uploads/2025/02/TRIO_Blue.webp",
        },

        // ============================================================
        // NOVOgen COLOR GREEN
        // ============================================================

        {
            uid: "brd-novogen-color-green",
            name: "NOVOgen Color Green",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.GREEN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description:
                "Linhagem NOVOGEN COLOR selecionada para rusticidade, adaptação a diferentes sistemas de produção e produção de ovos de casca verde.",
            urlImage: "https://novogen-layers.com/wp-content/uploads/2025/02/TRIO_Green.webp",
        },

        // ============================================================
        // ISA BROWN
        // ============================================================

        {
            uid: "brd-isa-brown",
            name: "ISA Brown",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos de casca marrom.",
            urlImage:
                "https://d1lg8auwtggj9x.cloudfront.net/images/ISA_Brown_010_HG_615_2901.width-610.jpg",
        },

        // ============================================================
        // NOVOgen TINTED
        // ============================================================

        {
            uid: "brd-novogen-tinted",
            name: "NOVOgen Tinted",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.TINTED,
            breedPurpose: BreedPurpose.LAYING,
            description:
                "Linhagem comercial de galinha poedeira de ovos de casca colorida, adaptável a diferentes condições de produção.",
            urlImage:
                "https://novogen-layers.com/wp-content/uploads/2025/02/Duo_NovogenTinted.webp",
        },

        // ============================================================
        // NOVOgen BROWN
        // ============================================================

        {
            uid: "brd-novogen-brown",
            name: "NOVOgen Brown",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description:
                "Linhagem comercial de galinha poedeira de ovos de casca marrom, selecionada para adaptação e desempenho.",
            urlImage: "https://novogen-layers.com/wp-content/uploads/2025/01/Duo_NovogenBrown.webp",
        },

        // ============================================================
        // NOVOgen WHITE
        // ============================================================

        {
            uid: "brd-novogen-white",
            name: "NOVOgen White",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.WHITE,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos de casca branca.",
            urlImage: "https://novogen-layers.com/wp-content/uploads/2025/02/Duo_NovogenWhite.webp",
        },

        // ============================================================
        // HY-LINE BROWN MAX
        // ============================================================

        {
            uid: "brd-hyline-brown-max",
            name: "Hy-Line Brown Max",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description:
                "Linhagem de poedeira marrom selecionada para produção de ovos grandes, casca marrom escura e persistência de produção.",
            urlImage: "https://www.hyline.com/filesimages/ChickenPics/Hy-Line_Brown_min.jpg",
        },

        // ============================================================
        // DEKALB WHITE
        // ============================================================

        {
            uid: "brd-dekalb-white",
            name: "Dekalb White",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.WHITE,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos de casca branca.",
            urlImage:
                "https://d1lg8auwtggj9x.cloudfront.net/images/Dekalb_White_024_HG_612_3709.width-610.jpg",
        },

        // ============================================================
        // LOHMANN BROWN-CLASSIC
        // ============================================================

        {
            uid: "brd-lohmann-brown-classic",
            name: "Lohmann Brown-Classic",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos de casca marrom.",
            urlImage: "https://lohmann-breeders.com/media/2025/03/ps-lb-classic-1.png",
        },
    ]);

    await breedRepository.upsert(breeds, ["uid"]);
}
