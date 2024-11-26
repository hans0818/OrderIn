export const groupAndSortMenuData = (menuItems) => {
  const groupedData = menuItems.reduce((acc, item) => {
    const { category, order, categoryOrder, id } = item;

    if (!acc[category]) {
      acc[category] = {
        order: categoryOrder || 0,
        items: [],
      };
    }

    const uniqueId = `${category}-${id}`;
    acc[category].items.push({
      ...item,
      order: order || 0,
      uniqueId,
    });

    return acc;
  }, {});

  Object.keys(groupedData).forEach((category) => {
    groupedData[category].items.sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  const sortedCategories = Object.keys(groupedData).sort(
    (a, b) => (groupedData[a].order || 0) - (groupedData[b].order || 0)
  );

  const result = sortedCategories.map((category, index) => {
    const navId = `nav-${index + 1}`;
    return {
      category,
      order: groupedData[category].order,
      items: groupedData[category].items,
      className: `category-box-${index + 1}`,
      navId,
    };
  });

  return result;
};