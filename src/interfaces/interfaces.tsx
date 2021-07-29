export interface PokemonCard {
    name: string;
    url: string;
    id?: number;
    showCard: boolean;
    couplet: boolean;
}

export interface ApiPokemon {
    count: number;
    next: null | string;
    previous: null | string;
    results: PokemonCard[];
}

export interface History {
    time: string;
    count_errors: number;
    __v?: number;
    _id ?: string
}