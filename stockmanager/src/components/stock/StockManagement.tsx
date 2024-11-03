import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal'; 
import './StockManagement.css';

interface StockEntry {
  productId: number;
  quantity: number;
  price: number;
  batch: string;
  imageUrl?: string; 
}

interface StockExit {
  productId: number;
  quantity: number;
  price: number;
  batch: string;
  imageUrl?: string; 
}

interface TotalStock {
  totalStockQuantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  manufacturer: string;
  image?: string;
}

const StockManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('entries');
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [exits, setExits] = useState<StockExit[]>([]);
  const [totalStock, setTotalStock] = useState<TotalStock | null>(null);
  const [newEntry, setNewEntry] = useState<StockEntry>({ productId: 0, quantity: 0, price: 0, batch: '' });
  const [newExit, setNewExit] = useState<StockExit>({ productId: 0, quantity: 0, price: 0, batch: '' });
  const [newProduct, setNewProduct] = useState<{ name: string; description: string; manufacturer: string; image?: string }>({
    name: '',
    description: '',
    manufacturer: '',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
    fetchExits();
    fetchTotalStock();
    fetchProducts();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/products/manage/entry', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchExits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/products/manage/exit', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExits(response.data);
    } catch (error) {
      console.error("Error fetching exits:", error);
    }
  };

  const fetchTotalStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/stock', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalStock(response.data);
    } catch (error) {
      console.error("Error fetching total stock:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/products/manage/entry', newEntry, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEntries();
      fetchTotalStock();
      setNewEntry({ productId: 0, quantity: 0, price: 0, batch: '' });
      setErrorMessage(null);
      setSuccessMessage("Entrada criada com sucesso!"); 
      setTimeout(() => setSuccessMessage(null), 5000); 
    } catch (error) {
      setErrorMessage("Erro ao criar entrada.");
      setSuccessMessage(null); 
      console.error("Error creating entry:", error);
    }
  };

  const handleCreateExit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/products/manage/exit', newExit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchExits();
      fetchTotalStock();
      setNewExit({ productId: 0, quantity: 0, price: 0, batch: '' });
      setErrorMessage(null);
      setSuccessMessage("Saída criada com sucesso!"); 
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage("Erro ao criar saída.");
      setSuccessMessage(null);
      console.error("Error creating exit:", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        image: newProduct.image || '', 
      };
  
      const token = localStorage.getItem('token'); 
  
      await axios.post('http://localhost:4000/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setNewProduct({ name: '', description: '', manufacturer: '', image: '' }); 
      setErrorMessage(null);
      setSuccessMessage("Produto criado com sucesso!"); 
      setTimeout(() => setSuccessMessage(null), 5000);
      fetchProducts(); 
    } catch (error) {
      let errorMessage = "Erro ao criar produto.";
  
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
  
      setErrorMessage(errorMessage);
      setSuccessMessage(null); 
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, selectedProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchProducts();
        closeModal();
        setSuccessMessage("Produto atualizado com sucesso!");
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (error) {
        setErrorMessage("Erro ao atualizar produto.");
        console.error("Error updating product:", error);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      setSuccessMessage("Produto deletado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setErrorMessage("Erro ao deletar produto.");
      console.error("Error deleting product:", error);
    }
  };

  const onDropProductImage = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps: getRootPropsProduct, getInputProps: getInputPropsProduct } = useDropzone({
    onDrop: onDropProductImage,
  });

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container stock-management-container">
      <h2 className="stock-management-title">Gerenciamento de Estoque</h2>
      <div className="tab-menu">
        <button className={`tab-button ${activeTab === 'entries' ? 'active' : ''}`} onClick={() => setActiveTab('entries')}>Entradas</button>
        <button className={`tab-button ${activeTab === 'exits' ? 'active' : ''}`} onClick={() => setActiveTab('exits')}>Saídas</button>
        <button className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventário</button>
        <button className={`tab-button ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Cadastrar Produtos</button>
        <button className={`tab-button ${activeTab === 'list-products' ? 'active' : ''}`} onClick={() => setActiveTab('list-products')}>Listar Produtos</button>
      </div>

      {activeTab === 'entries' && (
        <div className="tab-content">
          <h3>Criar nova entrada</h3>
          <label>Id do Produto</label>
          <input
            type="number"
            placeholder="Product ID"
            className="form-control stock-management-input"
            value={newEntry.productId}
            onChange={e => setNewEntry({ ...newEntry, productId: Number(e.target.value) })}
          />
          <label>Quantidade</label>
          <input
            type="number"
            placeholder="Quantity"
            className="form-control stock-management-input"
            value={newEntry.quantity}
            onChange={e => setNewEntry({ ...newEntry, quantity: Number(e.target.value) })}
          />
          <label>Preço de Compra</label>
          <input
            type="number"
            placeholder="Price"
            className="form-control stock-management-input"
            value={newEntry.price}
            onChange={e => setNewEntry({ ...newEntry, price: Number(e.target.value) })}
          />
          <label>Lote</label>
          <input
            type="text"
            placeholder="Lote"
            className="form-control stock-management-input"
            value={newEntry.batch}
            onChange={e => setNewEntry({ ...newEntry, batch: e.target.value })}
          />
          <button className="btn btn-primary stock-management-button" onClick={handleCreateEntry}>Confirmar</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <h3>Entradas no estoque</h3>
          <ul className="stock-management-list">
            {entries.map(entry => (
              <li key={entry.productId} className="stock-management-list-item">
                Produto ID: {entry.productId}, Quantidade: {entry.quantity}, Preço: {entry.price}, Lote: {entry.batch}
                {entry.imageUrl && <img src={entry.imageUrl} alt="Entry" className="image-thumbnail" />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'exits' && (
        <div className="tab-content">
          <h3>Criar nova saída</h3>
          <label>Id do Produto</label>
          <input
            type="number"
            placeholder="Product ID"
            className="form-control stock-management-input"
            value={newExit.productId}
            onChange={e => setNewExit({ ...newExit, productId: Number(e.target.value) })}
          />
          <label>Quantidade</label>
          <input
            type="number"
            placeholder="Quantity"
            className="form-control stock-management-input"
            value={newExit.quantity}
            onChange={e => setNewExit({ ...newExit, quantity: Number(e.target.value) })}
          />
          <label>Preço</label>
          <input
            type="number"
            placeholder="Price"
            className="form-control stock-management-input"
            value={newExit.price}
            onChange={e => setNewExit({ ...newExit, price: Number(e.target.value) })}
          />
          <label>Lote</label>
          <input
            type="text"
            placeholder="Lote"
            className="form-control stock-management-input"
            value={newExit.batch}
            onChange={e => setNewExit({ ...newExit, batch: e.target.value })}
          />
          <button className="btn btn-primary stock-management-button" onClick={handleCreateExit}>Confirmar</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <h3>Saídas do estoque</h3>
          <ul className="stock-management-list">
            {exits.map(exit => (
              <li key={exit.productId} className="stock-management-list-item">
                Produto ID: {exit.productId}, Quantidade: {exit.quantity}, Preço: {exit.price}, Lote: {exit.batch}
                {exit.imageUrl && <img src={exit.imageUrl} alt="Exit" className="image-thumbnail" />}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'inventory' && totalStock && (
        <div className="tab-content">
          <h3>Total de Estoque</h3>
          <p>Quantidade Total: {totalStock.totalStockQuantity}</p>
        </div>
      )}

      {activeTab === 'list-products' && (
        <div className="tab-content">
          <h3>Lista de Produtos</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Fabricante</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.image && <img src={product.image} alt={product.name} className="image-thumbnail" />}</td>
                  <td>
                    <button className="product-button" onClick={() => openModal(product)}>Editar</button>
                    <button className="product-button" onClick={() => handleDeleteProduct(product.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className="modal-content">
          <h2 className="modal-title">Editar Produto</h2>
          <label>Nome</label>
          <input
            type="text"
            placeholder="Nome"
            className="form-control stock-management-input"
            value={selectedProduct?.name || ''}
            onChange={e => setSelectedProduct({ ...selectedProduct!, name: e.target.value })}
          />
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Descrição"
            className="form-control stock-management-input"
            value={selectedProduct?.description || ''}
            onChange={e => setSelectedProduct({ ...selectedProduct!, description: e.target.value })}
          />
          <label>Fabricante</label>
          <input
            type="text"
            placeholder="Fabricante"
            className="form-control stock-management-input"
            value={selectedProduct?.manufacturer || ''}
            onChange={e => setSelectedProduct({ ...selectedProduct!, manufacturer: e.target.value })}
          />
          <button className="modal-button" onClick={handleUpdateProduct}>Salvar</button>
          <button className="modal-button" onClick={closeModal}>Cancelar</button>
        </div>
      </Modal>

      {activeTab === 'products' && (
        <div className="tab-content">
          <h3>Criar novo produto</h3>
          <label>Nome</label>
          <input
            type="text"
            placeholder="Nome"
            className="form-control stock-management-input"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <label>Descrição</label>
          <input
            type="text"
            placeholder="Descrição"
            className="form-control stock-management-input"
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <label>Fabricante</label>
          <input
            type="text"
            placeholder="Fabricante"
            className="form-control stock-management-input"
            value={newProduct.manufacturer}
            onChange={e => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
          />
          <div {...getRootPropsProduct()} className="dropzone">
            <input {...getInputPropsProduct()} />
            <p>Arraste e solte uma imagem aqui, ou clique para selecionar uma imagem</p>
          </div>
          {newProduct.image && <img src={newProduct.image} alt="Preview" className="image-preview" />}
          <button className="btn btn-primary stock-management-button" onClick={handleCreateProduct}>Confirmar</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>} 
        </div>
      )}
    </div>
  );
};
    
export default StockManagement;
