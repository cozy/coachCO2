export const sortTimeserieSections = timeserie => {
  const unorderedSections = timeserie?.aggregation?.sections
  if (!unorderedSections) {
    return timeserie
  }
  const orderedSections = unorderedSections.sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })
  const timeserieWithSortedSections = { ...timeserie }
  timeserieWithSortedSections.aggregation.sections = orderedSections

  return timeserieWithSortedSections
}
