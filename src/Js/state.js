export function createAppState(initialItemsPerPage = 20) {
  const state = {
    allHeroes: [],
    filteredHeroes: [],
    currentPage: 1,
    itemsPerPage: initialItemsPerPage,
    filters: {
      search: "",
      gender: "all",
      alignment: "all",
      order: "az", 
    },
  };

  const applyFilters = () => {
    state.filteredHeroes = state.allHeroes.filter((hero) => {
      const searchLower = state.filters.search.toLowerCase();
      const matchesSearch = hero.name.toLowerCase().includes(searchLower); 

      const heroGender = hero.appearance.gender
        ? hero.appearance.gender.toLowerCase()
        : "-";
      const matchesGender =
        state.filters.gender === "all" || heroGender === state.filters.gender;

      const heroAlignment = hero.biography.alignment
        ? hero.biography.alignment.toLowerCase()
        : "-";
      const matchesAlignment =
        state.filters.alignment === "all" || heroAlignment === state.filters.alignment;

      return matchesSearch && matchesGender && matchesAlignment;
    });

    if (state.filters.order === "az") {
      state.filteredHeroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.filters.order === "za") {
      state.filteredHeroes.sort((a, b) => b.name.localeCompare(a.name));
    }
  };

  return {
    get currentPage() {
      return state.currentPage;
    },
    get itemsPerPage() {
      return state.itemsPerPage;
    },
    setHeroes(heroes) {
      state.allHeroes = heroes;
      state.currentPage = 1;
      applyFilters();
    },
    setFilter(key, value) {
      state.filters[key] = value.toLowerCase();
      state.currentPage = 1;
      applyFilters();
    },
    getPaginatedHeroes() {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.filteredHeroes.slice(startIndex, endIndex);
    },
    getTotalPages() {
     return Math.ceil(state.filteredHeroes.length / state.itemsPerPage);
    },
    setPage(pageNumber) {
      const totalPages = this.getTotalPages();
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        state.currentPage = pageNumber;
        return true;
      }
      return false;
    },
  };
}