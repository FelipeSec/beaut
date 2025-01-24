interface Product {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  faixa_preco: string;
  beneficios_principais: string[];
  onde_comprar: string[];
}

interface Price {
  store: string;
  price: string;
  link: string;
}

export type { Product, Price };