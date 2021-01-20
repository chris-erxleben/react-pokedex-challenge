import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core'
import { useStyles } from './List.style'

export function List({ history }) {
  const classes = useStyles()
  const [filteredData, setFilteredData] = useState([])
  const [types, setTypes] = useState([])
  const [weaknesses, setWeaknesses] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedWeaknesses, setSelectedWeaknesses] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const { data, isLoading } = useQuery('pokemon', () =>
    fetch(
      'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json'
    ).then(res => res.json())
  )
  useEffect(() => {
    if (data) {
      // Set types dynamically only once
      if (!types.length) {
        setTypes(
          Array.from(
            data.pokemon.reduce((acc, { type }) => {
              type.forEach(t => {
                acc.add(t)
              })
              return acc
            }, new Set())
          )
        )
      }

      // Set weaknesses dynamically only once
      if (!weaknesses.length) {
        setWeaknesses(
          Array.from(
            data.pokemon.reduce((acc, { weaknesses }) => {
              weaknesses.forEach(w => {
                acc.add(w)
              })
              return acc
            }, new Set())
          )
        )
      }

      let result = data.pokemon
      if (selectedName) {
        result = result.filter(({ name }) =>
          name.toLowerCase().includes(selectedName.toLowerCase())
        )
      }
      if (selectedTypes.length) {
        result = result.filter(({ type }) =>
          selectedTypes.every(selectedType => type.includes(selectedType))
        )
      }
      if (selectedWeaknesses.length) {
        result = result.filter(({ weaknesses }) =>
          selectedWeaknesses.every(selectedWeakness =>
            weaknesses.includes(selectedWeakness)
          )
        )
      }
      setFilteredData(result)
    }
  }, [
    data,
    selectedName,
    selectedTypes,
    selectedWeaknesses,
    types.length,
    weaknesses.length,
  ])

  const handlePokemonNameChange = ({ target: { value } }) => {
    setSelectedName(value)
  }

  const handleSelectedTypeChange = ({ target: { value } }) => {
    setSelectedTypes(value)
  }

  const handleSelectedWeaknessesChange = ({ target: { value } }) => {
    setSelectedWeaknesses(value)
  }

  const handleViewClick = num => {
    history.push(`/${num}`)
  }

  return (
    <>
      <div>
        <TextField
          label="Pokémon Name"
          variant="outlined"
          value={selectedName}
          onChange={handlePokemonNameChange}
          className={classes.filter}
        />
        <FormControl className={classes.filter}>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            multiple
            value={selectedTypes}
            onChange={handleSelectedTypeChange}
          >
            {types.map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.filter}>
          <InputLabel id="weaknesses-select-label">Weakness</InputLabel>
          <Select
            labelId="weaknesses-select-label"
            id="weaknesses-select"
            multiple
            value={selectedWeaknesses}
            onChange={handleSelectedWeaknessesChange}
          >
            {weaknesses.map(weakness => (
              <MenuItem key={weakness} value={weakness}>
                {weakness}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Weaknesses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length ? (
              filteredData.map(({ id, num, name, type, weaknesses }) => (
                <TableRow key={id}>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewClick(num)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="right">{num}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{type.join(', ')}</TableCell>
                  <TableCell>{weaknesses.join(', ')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  {isLoading ? 'Loading...' : 'No results found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
