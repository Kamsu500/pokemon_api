import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./component/navbar/Navbar";
import "./App.css";

const App = () => {
  const [pokemon_data, set_pokemon_ata] = useState([]);
  const [pokemon_species_data, set_pokemon_species_data] = useState([]);
  const [pokemon_details, set_pokemon_details] = useState([]);
  const [loading_details, set_loading_details] = useState(true);

  const api_pokemon_species = "https://pokeapi.co/api/v2/pokemon-species?limit=40"; // limit to 40 for example

  // fetch species data
  const fetch_pokemon_species_data = useCallback(async () => {
    try {
      const response = await fetch(api_pokemon_species);
      const data = await response.json();
      console.log(data);
      set_pokemon_species_data(data.results);
    } catch (error) {
      console.error("Error fetching Pokemon species data:", error);
    }
  }, [api_pokemon_species, set_pokemon_species_data]);

  // fetch pokemon data
  const fetch_pokemon_data = useCallback(async () => {
    try {
      const response = await fetch(api_pokemon_species);
      const data = await response.json();
      console.log(data);
      const detailsPromises = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
      });

      const details = await Promise.all(detailsPromises);
      set_pokemon_ata(details);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  }, [api_pokemon_species, set_pokemon_ata]);

  // fetch details data
  const fetch_details = useCallback(async () => {
    const details = await Promise.all(
      pokemon_species_data.map(async (species) => {
        try {
          const response = await fetch(species.url);
          const species_details = await response.json();
          console.log(species_details)
          const description = species_details
            ? species_details.flavor_text_entries.find(
                (entry) => entry.language.name === "en"
              ).flavor_text
            : "N/A";
          const height = species_details ? species_details.height : "N/A";
          const weight = species_details ? species_details.weight : "N/A";
          const category = species_details
            ? species_details.genera.find(
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
    // update a list
    set_pokemon_details(details.filter((detail) => detail !== null));
    set_loading_details(false);
  }, [pokemon_species_data]);

  useEffect(() => {
    fetch_pokemon_species_data();
  }, [fetch_pokemon_species_data]);

  useEffect(() => {
    fetch_pokemon_data();
  }, [fetch_pokemon_data]);

  useEffect(() => {
    if (pokemon_species_data.length > 0) {
      fetch_details();
    }
  }, [fetch_details, pokemon_species_data]);

  return (
    <>
      <body className="bg-danger">
        <div className="h-25">
          <Navbar />
        </div>
        <div className="container-fluid mt-5" id="body">
          <div className="row">
            {loading_details ? (
              <p>Loading...</p>
            ) : (
              pokemon_details.map((pokemon, index) => {
                const specific_data = pokemon_data.find(
                  (data) => data.name === pokemon.name
                );
                return (
                  <div className="col-sm-6 col-md-3 mb-4" key={index}>
                    <div className="card h-100" id="card">
                      {specific_data && (
                        <img
                          src={specific_data.sprites.front_default}
                          className="card-img-top"
                          alt={specific_data.name}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{pokemon.name}</h5>
                        <p class="card-text">{pokemon.description}</p>
                        <hr />
                        <div className="row col">
                          <div class="col-lg-6">
                            Taille : {pokemon_details.height} m
                          </div>
                          <div className="col-lg-6">
                            Talents: {specific_data.abilities.map((ability, i) => (
                              <span key={i}>{ability.ability.name}</span>
                            ))}
                          </div>
                        </div>
                        <div className="row col">
                          <div class="col-lg-6">
                            Poids : {specific_data.weight} kg
                          </div>
                          <div class="col-lg-6">
                            category : {pokemon.category}
                          </div>
                        </div>
                        <hr />
                        <div>
                          {specific_data.types.map((type, i) => (
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
