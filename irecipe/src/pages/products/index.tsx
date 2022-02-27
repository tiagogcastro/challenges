import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import { Layout } from '../../components';

import { api } from '../../services/app_api';
import { Product } from '../../services/app_api/types';

import { useBoolean } from '../../hooks/useBoolean';
import { useAuth } from '../../hooks/useAuth';

import styles from './styles.module.scss';
import { toast } from 'react-toastify';
import { CreateUpdateProductModal } from '../../components/CreateUpdateProductModal';

const Products: NextPage = () => {
  const { signOut } = useAuth();

  const [products, setProducts] = useState<Product[]>([
    
  ]);
  const [product_to_update, setProductToUpdate] = useState<Product>({} as Product);

  const new_product_is_open = useBoolean();
  const save_product_is_open = useBoolean();

  async function getProducts() {
    try {
      const response = await api.product.list_all();

      setProducts(response.data.content);
    } catch(error: any) {
      if(axios.isAxiosError(error)) {
        const message_error = error.response?.data.message;
        
        toast(message_error, {
          autoClose: 5000,
          pauseOnHover: true,
          type: 'error',
          style: {
            background: '#fff',
            color: '#1a1919' ,
            fontSize: 14,
            fontFamily: 'Roboto, sans-serif',
          }
        });
      }
    }
  }
 
  useEffect(() => {
    getProducts();
  }, []);

  async function handleRemoveProduct(product: Product) {
    try {
      const response = await api.product.delete(product.id);

      if(response) {
        setProducts(prevState => {
          return prevState.filter(where => where.id !== product.id);
        });
      }
    } catch(error) {
      if(axios.isAxiosError(error)) {
        const message_error = error.response?.data.message;
        
        toast(message_error, {
          autoClose: 5000,
          pauseOnHover: true,
          type: 'error',
          style: {
            background: '#fff',
            color: '#1a1919' ,
            fontSize: 14,
            fontFamily: 'Roboto, sans-serif',
          }
        });
      }
    }
  }

  const handleUpdateProduct = useCallback((product: Product) => {
    setProductToUpdate(product);
    
    save_product_is_open.changeToTrue();
  }, [save_product_is_open]);

  const itemsPerPage = 10;
  const [currentItems, setCurrentItems] = useState<Product[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);

    setCurrentItems(products.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, products]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    console.log(event)
    const newOffset = (event.selected * itemsPerPage) % products.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return(
    <Layout>
      <div className={styles.products_page_container}>
        <div className={styles.products_page_content}>
          <header className={styles.products_page_header}>
            <div className={styles.left_header}>
              <img 
                src="/app_logo.png" 
                className={styles.app_logo}  
              />
              <button
                onClick={signOut}
              >
                Sair
              </button>
            </div>
            <button
              className={styles.new_product}
              onClick={new_product_is_open.changeToTrue}
            >
              Novo produto
            </button>
          </header>
          <section className={styles.products_container}>
            {products.length > 0 && products.map(product => (
              <div className={styles.product_item} key={product.id}>
                <button 
                  className={styles.remove_product}
                  onClick={() => handleRemoveProduct(product)}
                  title="Remover produto"
                >
                  X
                </button>
                <img src={product.image} alt={product.name} />
                <strong className={styles.product_item_title}>{product.name}</strong>
                <strong
                  className={styles.product_item_ingredients}
                >
                  {product.ingredients.length} {product.ingredients.length <= 1 ? 'ingrediente' : 'ingredientes'}
                </strong>
                <footer className={styles.product_item_footer}>
                  <span className={styles.product_item_price}>R$ {product.price}</span>
                  <button className={styles.edit_product} onClick={() => handleUpdateProduct(product)}>Editar</button>
                </footer>
              </div>
            ))}
          </section>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
          />
        </div>
      </div>
      
      <CreateUpdateProductModal
        getProducts={getProducts}
        isOpen={new_product_is_open}
        form_title= 'Cadastrar produto'
      />

      <CreateUpdateProductModal
        getProducts={getProducts}
        isOpen={save_product_is_open}
        form_title= 'Editar produto'
        defaultValue={product_to_update}
      />
    </Layout>
  );
}

export default Products;
