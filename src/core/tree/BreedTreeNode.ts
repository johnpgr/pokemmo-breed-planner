import { usePokemonToBreed } from "@/components/PokemonToBreedContext"
import type { PokemonGender, PokemonIv, PokemonNature, PokemonSpecies } from "../pokemon"
import { PokemonBreedTreePosition } from "./BreedTreePosition"
import type { PokemonBreedTreeMap } from "./useBreedTreeMap"

export class PokemonBreedTreeNode {
    constructor(
        public position: PokemonBreedTreePosition,
        public species?: PokemonSpecies,
        public gender?: PokemonGender,
        public nature?: PokemonNature,
        public ivs?: PokemonIv[],
        public nickname?: string,
    ) {}

    static EMPTY(pos: PokemonBreedTreePosition): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode(pos)
    }

    static ROOT(ctx: ReturnType<typeof usePokemonToBreed>): PokemonBreedTreeNode {
        return new PokemonBreedTreeNode(
            new PokemonBreedTreePosition(0, 0),
            ctx.pokemon,
            undefined,
            ctx.nature,
            Object.values(ctx.ivs).filter(Boolean),
        )
    }

    public getChildNode(map: PokemonBreedTreeMap): PokemonBreedTreeNode | undefined {
        const childRow = this.position.row - 1
        const childCol = Math.floor(this.position.col / 2)
        const childPosition = new PokemonBreedTreePosition(childRow, childCol)

        return map[childPosition.key()]
    }

    public getPartnerNode(map: PokemonBreedTreeMap): PokemonBreedTreeNode | undefined {
        const partnerCol = (this.position.col & 1) === 0 ? this.position.col + 1 : this.position.col - 1
        const partnerPos = new PokemonBreedTreePosition(this.position.row, partnerCol)

        return map[partnerPos.key()]
    }

    public getParentNodes(map: PokemonBreedTreeMap): [PokemonBreedTreeNode, PokemonBreedTreeNode] | undefined {
        const parentRow = this.position.row + 1
        const parentCol = this.position.col * 2

        const parent1 = map[new PokemonBreedTreePosition(parentRow, parentCol).key()]
        const parent2 = map[new PokemonBreedTreePosition(parentRow, parentCol + 1).key()]

        if (!parent1 || !parent2) return undefined

        return [parent1, parent2]
    }

    public isRootNode(): boolean {
        return this.position.key() === "0,0"
    }
}
