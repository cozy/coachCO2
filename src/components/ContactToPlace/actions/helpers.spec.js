import { makeCustomLabel } from './helpers'

const t = x => x

describe('makeCustomLabel', () => {
  describe('if custom label', () => {
    it('should return label with type `perso`', () => {
      const res = makeCustomLabel({ label: 'custom', category: 'home', t })

      expect(res).toBe('custom (contacttoplace.perso)')
    })

    it('should return label with type `pro`', () => {
      const res = makeCustomLabel({ label: 'custom', category: 'work', t })

      expect(res).toBe('custom (contacttoplace.pro)')
    })
  })

  describe('if not custom label', () => {
    it('should return label for `home`', () => {
      const res = makeCustomLabel({
        label: 'contactToPlace.home',
        category: 'home',
        t
      })

      expect(res).toBe('contactToPlace.custom')
    })

    it('should return label for `work`', () => {
      const res = makeCustomLabel({
        label: 'contactToPlace.work',
        category: 'work',
        t
      })

      expect(res).toBe('contactToPlace.custom')
    })

    it('should return label', () => {
      const res = makeCustomLabel({ t })

      expect(res).toBe('contactToPlace.custom')
    })
  })
})
