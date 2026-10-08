import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindBreedsDTO } from "../../dtos/find-breed.dto";
import { BreedEntity } from "../../entities/breed.entity";
import { BreedPurpose } from "../../enums/breed-origin.enum";
import { EggColor } from "../../enums/egg-color.enum";
import { IBreedRepository } from "../breed-repository.interface";

export class InMemoryBreedRepository implements IBreedRepository {
    private breeds: BreedEntity[] = [
        new BreedEntity({
            uid: "brd_isa-brown",
            name: "ISA Brown",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos marrons.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-novogen-tinted",
            name: "NOVOgen Tinted",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.TINTED,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos de casca tinted.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-novogen-brown",
            name: "NOVOgen Brown",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos marrons.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-novogen-white",
            name: "NOVOgen White",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.WHITE,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos brancos.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-novogen-color-green",
            name: "NOVOgen Color Green",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.GREEN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description:
                "Linhagem COLOR da NOVOGEN selecionada para rusticidade e produção de ovos de casca verde.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-novogen-color-blue",
            name: "NOVOgen Color Blue",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BLUE,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description:
                "Linhagem COLOR da NOVOGEN selecionada para rusticidade e produção de ovos de casca azul.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-hyline-brown",
            name: "Hy-Line Brown",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos marrons.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-dekalb-white",
            name: "Dekalb White",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.WHITE,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos brancos.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-lohmann-brown-classic",
            name: "Lohmann Brown-Classic",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.LAYING,
            description: "Linhagem comercial de galinha poedeira de ovos marrons.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-bkb",
            name: "BKB",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description: "Linhagem avícola utilizada em sistemas de produção alternativos.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),

        new BreedEntity({
            uid: "brd-glc",
            name: "GLC",
            scientificName: "Gallus gallus domesticus",
            eggColor: EggColor.BROWN,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description: "Linhagem avícola utilizada em sistemas de produção alternativos.",
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
    ];

    async find(filters?: FindBreedsDTO): Promise<Result<PaginationResult<BreedEntity>>> {
        let breeds = this.breeds;

        if (filters?.uids?.length) {
            breeds = breeds.filter((breed) => filters.uids!.includes(breed.uid));
        }

        if (filters?.uid) {
            breeds = breeds.filter((breed) =>
                breed.uid.toLowerCase().includes(filters.uid!.toLowerCase())
            );
        }

        if (filters?.name) {
            breeds = breeds.filter((breed) =>
                breed.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.scientificName) {
            breeds = breeds.filter((breed) =>
                breed.scientificName?.toLowerCase().includes(filters.scientificName!.toLowerCase())
            );
        }

        if (filters?.eggColor) {
            breeds = breeds.filter((breed) => breed.eggColor === filters.eggColor);
        }

        if (filters?.breedPurpose) {
            breeds = breeds.filter((breed) => breed.breedPurpose === filters.breedPurpose);
        }

        if (filters?.orderBy) {
            breeds.sort((a, b) => {
                const valueA = a[filters.orderBy!] ?? "";
                const valueB = b[filters.orderBy!] ?? "";

                if (valueA < valueB) {
                    return filters.order === "desc" ? 1 : -1;
                }

                if (valueA > valueB) {
                    return filters.order === "desc" ? -1 : 1;
                }

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = breeds.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = breeds.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async findByUID(uid: string): Promise<Result<BreedEntity | null>> {
        const breed = this.breeds.find((breed) => StringUtil.equals(breed.uid, uid)) ?? null;

        return ResultFactory.success(breed);
    }
}
