export function filterArchives(archives, activeCategory) {
  if (activeCategory === 'ALL') return archives;
  return archives.filter(item => item.category === activeCategory);
}

