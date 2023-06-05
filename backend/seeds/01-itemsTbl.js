/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('table_name').del()
  await knex('table_name').insert([
    { id: 1, item_name: 'トイレットペーパー', item_stock: '2', consumption_day: '25', notification_stock: '1', registration_day: '2023-05-01' },
    { id: 1, item_name: '洗濯洗剤', item_stock: '2', consumption_day: '20', notification_stock: '1', registration_day: '2023-05-01' },
    { id: 1, item_name: 'シーチキン缶詰', item_stock: '5', consumption_day: '10', notification_stock: '1', registration_day: '2023-05-01' },
    { id: 1, item_name: 'ペットボトル水2L', item_stock: '6', consumption_day: '5', notification_stock: '3', registration_day: '2023-05-20' },
    { id: 1, item_name: 'うす焼き', item_stock: '7', consumption_day: '1', notification_stock: '2', registration_day: '2023-06-01' }

  ]);
};
