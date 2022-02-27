import axios from 'axios';
import * as Yup from 'yup';

import { Modal } from '../Modal';
import styles from './styles.module.scss';

import { useEffect, useState } from 'react';
import { useBoolean, UseBooleanData } from '../../hooks/useBoolean';

import { Product, Ingredient } from '../../services/app_api/types';
import { api } from '../../services/app_api';
import { toast } from 'react-toastify';
import { Input } from '../Input';
import { Button } from '../Button';
import { yupGetValidationErrors } from '../../utils/getValidationErrors';

type Props = {
  form_title: string;
  isOpen: UseBooleanData;
  defaultValue?: Product;
  getProducts: () => Promise<void>;
}

const schema_save_product = Yup.object().shape({
  image: Yup.string().required('Imagem é obrigatória'),
  name: Yup.string().required('Nome do produto é obrigatório'),
  price: Yup.number().min(1, 'Coloque um valor do produto de 1 ou mais'),
  ingredients: Yup.array<Ingredient[]>().of(
    Yup.object().shape({
      cost: Yup.number().min(1, 'Coloque um valor do ingrediente de 1 ou mais'),
      name: Yup.string().required('Nome do ingrediente é obrigatório'),
      quantity: Yup.number().min(1, 'Coloque uma quantidade de ingrediente de 1 ou mais')
    })
  )
});

export function CreateUpdateProductModal({
  form_title,
  defaultValue, 
  isOpen,
  getProducts,
}: Props) {
  const [selected_file, setSelectedFile] = useState<File | null>(null);
  const [file_preview, setFilePreview] = useState<string | undefined>();
  
  const save_product_loading = useBoolean();

  useEffect(() => {
    setSelectedFile(new File(['product_image'], defaultValue?.image ? defaultValue?.image : ''));
    setFilePreview(defaultValue?.image);
    setSaveProduct(prevState => {
      return defaultValue ? defaultValue : prevState;
    });
  }, [defaultValue])
  
  const [save_product, setSaveProduct] = useState<Product>({
    image: '', 
    ingredients: [
      {
        cost: 0,
        name: '',
        quantity: 0,
      }
    ],
    name: '',
    price: 0,
  });
  
  async function handleSaveProduct(event: React.FormEvent) {
    event.preventDefault();

    save_product_loading.changeToTrue();

    const product_formatted = {
      ...save_product,
      price: Number(save_product.price),
      ingredients: save_product.ingredients.map(ing => {
        return {
          name: ing.name,
          cost: Number(ing.cost),
          quantity: Number(ing.quantity),
        }
      })
    }

    try {
      await schema_save_product.validate(product_formatted, {
        abortEarly: false
      });
      
      await api.product.save(product_formatted);

      toast('Produto salvo com sucesso', {
        autoClose: 5000,
        pauseOnHover: true,
        type: 'success',
        style: {
          background: '#fff',
          color: '#1a1919' ,
          fontSize: 14,
          fontFamily: 'Roboto, sans-serif',
        }
      });

      getProducts();

      isOpen.changeToFalse();
    } catch(error: any) {
      if(error instanceof Yup.ValidationError) {
        const errors = yupGetValidationErrors(error);
  
        errors.forEach(error => {
          toast(error.message, {
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
        })
      }
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
    } finally {
      save_product_loading.changeToFalse();
    }
  }

  function handleChangeInput(field: string, value: any) {
    setSaveProduct(prevState => {
      return {
        ...prevState,
        [field]: value
      };
    });
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileTypeAccepted = ['image/png', 'image/svg+xml', 'image/svg' ,'image/jpeg'];

    const oneFile = e.target.files?.item(0);

    if(oneFile) {
      if (!fileTypeAccepted.includes(oneFile?.type)) {
        return setSelectedFile(null);
      }

      setSelectedFile(oneFile);
      setFilePreview(oneFile.name);
      setSaveProduct(prevState => {
        return {
          ...prevState,
          image: oneFile.name
        }
      })
    };
  }

  function handleChangeIngredientsInput(field: string, index: number, value: any) {
    setSaveProduct(prevState => {
      return {
        ...prevState,
        ingredients: prevState.ingredients.map((item, prevstate_index) => prevstate_index === index ? {
          ...item,
          [field]: value,
        }: item)
      }
    });
  }

  function handleAddNewIngredient() {
    setSaveProduct(prevState => {
      return {
        ...prevState,
        ingredients: [
          ...prevState.ingredients,
          {
            id: Date.now() * Math.PI,
            cost: 0,
            name: '',
            quantity: 0,
          }
        ] 
      }
    });

    toast('Novo ingrediente adicionado', {
      autoClose: 3000,
      pauseOnHover: true,
      type: 'success',
      style: {
        background: '#fff',
        color: '#1a1919' ,
        fontSize: 14,
        fontFamily: 'Roboto, sans-serif',
      }
    });
  }
  
  function handleRemoveIngredient(ingredient: Ingredient) {
    setSaveProduct(prevState => {
      return {
        ...prevState,
        ingredients: prevState.ingredients.filter((where) => {
          return where.id !== ingredient.id;
        }),
      }
    });

    toast('Ingrediente removido!', {
      autoClose: 3000,
      pauseOnHover: true,
      type: 'success',
      style: {
        background: '#fff',
        color: '#1a1919' ,
        fontSize: 14,
        fontFamily: 'Roboto, sans-serif',
      }
    });
  }

  return (
    <Modal isOpen={isOpen.state}>
      <div className={styles.save_product_modal_container}>
        <div className={styles.save_product_modal_content}>
          <form onSubmit={handleSaveProduct}>
            <header className={styles.form_header}>
              <h1 className={styles.form_title}>{form_title}</h1>
              <button type="button" onClick={isOpen.changeToFalse}>X</button>
            </header>

            <Input 
              field_title="Imagem"
              type="file" 
              onChange={onSelectFile}
              defaultValue={file_preview}
              disabled={save_product_loading.state}
            />
            {<span>{file_preview}</span>}
            <Input 
              field_title="Nome"
              type="text" 
              onChange={(e) => handleChangeInput('name', e.target.value)}
              disabled={save_product_loading.state}
              defaultValue={save_product.name}
            />
            <Input 
              field_title="Preço"
              type="number" 
              onChange={(e) => handleChangeInput('price', e.target.value)}
              disabled={save_product_loading.state}
              defaultValue={save_product.price}
            />
            <Input
              has_input={false}
            >
              <header>
                <span className={styles.form_field_title}>Ingredientes</span>
                <button type="button" onClick={handleAddNewIngredient}>Add +</button>
              </header>
              {save_product?.ingredients && save_product?.ingredients.map((ingredient, index) => (
                <div className={styles.form_field_ingredients} key={index}>
                  <span className={styles.index_count}>{index + 1}</span>
                  {save_product?.ingredients.length > 1 && (
                    <button 
                      className={styles.remove_ingredients}
                      onClick={() => handleRemoveIngredient(ingredient)}
                    >
                      X
                    </button>
                  )}
                  <div className={styles.ingredients_fields}>
                    <Input 
                      field_title="Custo"
                      type="number" 
                      onChange={(e) => handleChangeIngredientsInput('cost', index, e.target.value)}
                      disabled={save_product_loading.state}
                      defaultValue={ingredient.cost}
                    />
                    <Input 
                      field_title="Nome"
                      type="text" 
                      onChange={(e) => handleChangeIngredientsInput('name', index, e.target.value)}
                      disabled={save_product_loading.state}
                      defaultValue={ingredient.name}
                    />
                    <Input 
                      field_title="Quantidade"
                      type="number" 
                      onChange={(e) => handleChangeIngredientsInput('quantity', index, e.target.value)}
                      disabled={save_product_loading.state}
                      defaultValue={ingredient.quantity}
                    />
                  </div>
                </div>
              ))}
            </Input>
            <Button 
              type="submit"
              button_title={form_title}
              isLoading={save_product_loading}
            />
          </form>
        </div>
      </div>
    </Modal>
  )
}