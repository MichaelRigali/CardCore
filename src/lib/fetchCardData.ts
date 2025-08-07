export async function fetchCardData(name: string) {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name}`, {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || '',
      },
    });
    const data = await res.json();
    return data.data;
  }
  