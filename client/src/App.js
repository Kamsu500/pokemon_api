import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./component/navbar/Navbar";
import "./App.css";

function App() {

  const [pokemonSpeciesData, setPokemonSpeciesData] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);

  const [loading, setLoading] = useState(true);
  const myUrl = "https://pokeapi.co/api/v2/pokemon-species?limit=20"; // Limitez à 20 Pokémon pour l'exemple

  const fetchPokemonSpeciesData = useCallback(
    async () => {
    try {
      const response = await fetch(myUrl);
      const data = await response.json();
      console.log(data);
      setPokemonSpeciesData(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon species data:", error);
    }
  }, [myUrl, setPokemonSpeciesData]);

  const fetchPokemonData = useCallback(
    async () => {
    try {
      const response = await fetch(myUrl);
      const data = await response.json();
      const detailsPromises = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      });

      const details = await Promise.all(detailsPromises);
      setPokemonData(details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  }, [myUrl, setPokemonData]);

  const fetchDetails = useCallback(
    async () => {
    const details = await Promise.all(
      pokemonSpeciesData.map(async (species) => {
        try {
          const response = await fetch(species.url);
          const speciesDetails = await response.json();

          const description = speciesDetails
            ? speciesDetails.flavor_text_entries.find(
                (entry) => entry.language.name === "en"
              ).flavor_text
            : "N/A";
          const height = speciesDetails ? speciesDetails.height : "N/A";
          const weight = speciesDetails ? speciesDetails.weight : "N/A";
          const category = speciesDetails
            ? speciesDetails.genera.find(
                (genus) => genus.language.name === "en"
              ).genus
            : "N/A";

          return {
            name: species.name,
            description: description,
            height: height,
            weight: weight,
            category: category,
          };
        } catch (error) {
          console.error("Error fetching Pokemon details:", error);
          return null;
        }
      })
    );

    setPokemonDetails(details.filter((detail) => detail !== null));
    setLoading(false);
  }, [pokemonSpeciesData]);

  useEffect(() => {
    fetchPokemonSpeciesData();
  }, [fetchPokemonSpeciesData]);

  useEffect(() => {
    fetchPokemonData();
  }, [fetchPokemonData]);

  useEffect(() => {
    if (pokemonSpeciesData.length > 0) {
      fetchDetails();
    }
  }, [fetchDetails, pokemonSpeciesData]);

  return (
    <>
      <body className="bg-danger">
        <div className="h-25">
          <Navbar />
        </div>
        <div className="container-fluid mt-5" id="body">
          <div className="row">
            {loading ? (
              <p>Loading...</p>
            ) : (
              pokemonDetails.map((pokemon, index) => {
                pokemonData.find((data) => data.name === pokemon.name);
                return (
                  <div className="col-sm-6 col-md-3 mb-4" key={index}>
                    <div className="card h-100" id="card">
                      {pokemonData && (
                        <img
                          src={pokemonData.sprites.front_default}
                          className="card-img-top"
                          alt={pokemonData.name}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{pokemon.name}</h5>
                        <p class="card-text">{pokemon.description}</p>
                        <hr />
                        <div className="row col">
                          <div class="col-lg-6">
                            Taille : 
                            {pokemonData.height} m
                          </div>
                          <div className="col-lg-6">
                            Talents:
                            {pokemonData.abilities.map((ability, i) => (
                              <span key={i}>{ability.ability.name}</span>
                            ))}
                          </div>
                        </div>
                        <div className="row col">
                          <div class="col-lg-6">
                            Poids : 
                            {pokemonData.weight} kg
                          </div>
                          <div class="col-lg-6">
                            category : 
                            {pokemon.category}
                          </div>
                        </div>
                        <hr />
                        <div>
                          {pokemonData.types.map((type, i) => (
                            <span key={i} className="badge bg-primary mx-1">
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </body>
    </>
  );
};

export default App;
