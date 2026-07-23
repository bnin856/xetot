// Xe 0km là xe mới; xe đã chạy (soKm > 0) luôn là xe cũ đã qua sử dụng.
export const tinhTrangXeTuSoKm = (soKm: number): 'xeMoi' | 'xeCu' => {
  return soKm > 0 ? 'xeCu' : 'xeMoi';
};
