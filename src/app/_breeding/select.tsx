'use client'
import { Button } from '@/app/_components/ui/button'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/app/_components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/ui/popover'
import { ScrollArea } from '@/app/_components/ui/scroll-area'
import { Separator } from '@/app/_components/ui/separator'
import { Pokemon } from '@/data/types'
import { getPokemonByName, getSprite, parseNames } from '@/lib/utils'
import { For, block } from 'million/react'
import { Fragment, useId, useState } from 'react'
import type { Breed, Gender, Position } from './types'

const PokemonSelect = block(
  (props: {
    pokemons: {
      name: string
      number: number
    }[]
    position: Position
    set: (key: Position, value: Breed | null) => void
  }) => {
    const id = useId()

    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState<string | undefined>(
      undefined,
    )
    const [gender, setGender] = useState<Gender | undefined>(undefined)

    async function handleSelectPokemon(name: string) {
      const pokemon = await getPokemonByName(name)
      setSelectedPokemon(pokemon.name)

      props.set(props.position, {
        gender: 'Female',
        pokemon,
      })

      setIsOpen(false)
    }

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size={'icon'} className="rounded-full bg-neutral-300 dark:bg-neutral-800">
            {selectedPokemon && (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={getSprite(selectedPokemon)}
                style={{
                  imageRendering: 'pixelated',
                }}
                className="mb-1"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <Command>
            <CommandInput
              placeholder='Search pokemon...'
              value={search}
              onValueChange={setSearch}
              data-cy="search-pokemon-input"
            />
            <CommandEmpty>
              No results
            </CommandEmpty>
            <CommandGroup>
              <ScrollArea className='h-72'>
              <For
                each={props.pokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(search.toLowerCase()))}
              >
                {(pokemon) => (
                  <Fragment key={`${id}:${pokemon.name}`}>
                    <CommandItem
                      value={pokemon.name}
                      onSelect={handleSelectPokemon}
                      data-cy={`${pokemon.name}-value`}
                    >
                      {parseNames(pokemon.name)}
                    </CommandItem>
                    <Separator />
                  </Fragment>
                )}
              </For>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

export default PokemonSelect
