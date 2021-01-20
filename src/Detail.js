import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import { Button, Typography } from '@material-ui/core'

export function Detail({ match, history }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const { data, isLoading } = useQuery('pokemon', () =>
    fetch(
      'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
    ).then(res => res.json())
  )
  useEffect(() => {
    if (data) {
      setSelectedPokemon(
        data.pokemon.find(({ num }) => num.toString() === match.params.num)
      )
    }
  }, [data, match])

  const handleBackToListClick = () => {
    history.push('/')
  }

  const handleEvolutionClick = num => {
    history.push(`/${num}`)
  }

  return selectedPokemon ? (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleBackToListClick()}
      >
        Back to List
      </Button>
      <Typography variant="h3">{selectedPokemon.name}</Typography>
      <img src={selectedPokemon.img} alt={selectedPokemon.name} />
      <Typography>Num: {selectedPokemon.num}</Typography>
      <Typography>Type: {selectedPokemon.type.join(', ')}</Typography>
      <Typography>
        Weaknesses: {selectedPokemon.weaknesses.join(', ')}
      </Typography>
      <Typography>Height: {selectedPokemon.height}</Typography>
      <Typography>Weight: {selectedPokemon.weight}</Typography>
      {selectedPokemon.prev_evolution ? (
        <div>
          <Typography>Previous Evolution:</Typography>
          {selectedPokemon.prev_evolution.map(({ num, name }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEvolutionClick(num)}
            >
              {name}
            </Button>
          ))}
        </div>
      ) : null}
      {selectedPokemon.next_evolution ? (
        <div>
          <Typography>Next Evolution:</Typography>
          {selectedPokemon.next_evolution.map(({ num, name }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEvolutionClick(num)}
            >
              {name}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  ) : (
    <Typography>{isLoading ? 'Loading...' : 'No Pokemon found'}</Typography>
  )
}
