import { makeOptions } from 'src/components/EditDialogs/helpers'
import {
  AIR_MODE,
  BICYCLING_CATEGORY,
  CAR_CATEGORY,
  MOTO_CATEGORY,
  PUBLIC_TRANSPORT_CATEGORY,
  UNKNOWN_MODE,
  WALKING_MODE
} from 'src/constants'

describe('makeOptions', () => {
  const t = jest.fn(x => x)
  describe('Without default mode and action', () => {
    it('returns an object with children array', () => {
      const options = makeOptions(t)
      expect(options).toHaveProperty('children')
      expect(Array.isArray(options.children)).toBe(true)
    })

    it('returns an object with children array containing walking mode', () => {
      const options = makeOptions(t)
      const walkingMode = options.children.find(
        option => option.id === WALKING_MODE
      )
      expect(walkingMode).toBeDefined()
    })

    it('returns an object with children array containing bicycling category', () => {
      const options = makeOptions(t)
      const bicyclingCategory = options.children.find(
        option => option.id === `categories.${BICYCLING_CATEGORY.name}`
      )
      expect(bicyclingCategory).toBeDefined()
      expect(bicyclingCategory.children.length).toBe(
        BICYCLING_CATEGORY.modes.length
      )
    })

    it('returns an object with children array containing moto category', () => {
      const options = makeOptions(t)
      const motoCategory = options.children.find(
        option => option.id === `categories.${MOTO_CATEGORY.name}`
      )
      expect(motoCategory).toBeDefined()
      expect(motoCategory.children.length).toBe(MOTO_CATEGORY.modes.length)
    })

    it('returns an object with children array containing car category', () => {
      const options = makeOptions(t)
      const carCategory = options.children.find(
        option => option.id === `categories.${CAR_CATEGORY.name}`
      )
      expect(carCategory).toBeDefined()
      expect(carCategory.children.length).toBe(CAR_CATEGORY.modes.length)
    })

    it('returns an object with children array containing public transport category', () => {
      const options = makeOptions(t)
      const publicTransportCategory = options.children.find(
        option => option.id === `categories.${PUBLIC_TRANSPORT_CATEGORY.name}`
      )
      expect(publicTransportCategory).toBeDefined()
      expect(publicTransportCategory.children.length).toBe(
        PUBLIC_TRANSPORT_CATEGORY.modes.length
      )
    })

    it('returns an object with children array containing air mode', () => {
      const options = makeOptions(t)
      const airMode = options.children.find(option => option.id === AIR_MODE)
      expect(airMode).toBeDefined()
    })

    it('returns an object with children array containing unknown mode', () => {
      const options = makeOptions(t)
      const unknownMode = options.children.find(
        option => option.id === UNKNOWN_MODE
      )
      expect(unknownMode).toBeDefined()
    })
  })

  describe('With default mode', () => {
    const defaultModes = { BICYCLING_CATEGORY: 'BICYCLING' }
    it('should have "default" in the "bicycling" mode title', () => {
      const options = makeOptions(t, { defaultModes })
      const bicyclingCategory = options.children.find(
        option => option.id === `categories.${BICYCLING_CATEGORY.name}`
      )
      const bicyclingMode = bicyclingCategory.children.find(
        option => option.id === 'BICYCLING'
      )
      const electricBicyclingMode = bicyclingCategory.children.find(
        option => option.id === 'BICYCLING_ELECTRIC'
      )
      expect(bicyclingMode).toBeDefined()
      expect(bicyclingMode.title).toBe(
        'trips.modes.BICYCLING (trips.modes.default)'
      )
      expect(electricBicyclingMode).toBeDefined()
      expect(electricBicyclingMode.title).toBe('trips.modes.BICYCLING_ELECTRIC')
    })
  })

  describe('With action', () => {
    const action = { Component: 'button' }
    it('should have "action" property', () => {
      const options = makeOptions(t, { action })
      expect(options).toHaveProperty('children')
      expect(Array.isArray(options.children)).toBe(true)

      const bicyclingCategory = options.children.find(
        option => option.id === `categories.${BICYCLING_CATEGORY.name}`
      )
      const bicyclingMode = bicyclingCategory.children.find(
        option => option.id === 'BICYCLING'
      )
      expect(bicyclingMode).toHaveProperty('action')
      expect(bicyclingMode.action).toEqual({ Component: 'button' })
    })
  })
})
