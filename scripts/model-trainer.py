import os
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model, load_model
from tensorflow.keras.layers import Dense, Dropout, LSTM, Embedding, Input, Conv1D, MaxPooling1D, Flatten
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard
import matplotlib.pyplot as plt
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("3RBAI-ModelTrainer")

class ModelTrainer:
    """
    3RBAI Universal Model Trainer
    
    A flexible training system that can handle various model architectures
    and training configurations for the 3RBAI system.
    """
    
    def __init__(self, config=None):
        """
        Initialize the model trainer with configuration
        
        Args:
            config (dict): Configuration dictionary with training parameters
        """
        self.config = config or {}
        self.model = None
        self.history = None
        self.model_dir = os.path.join(os.getcwd(), "models")
        os.makedirs(self.model_dir, exist_ok=True)
        
        logger.info("🤖 3RBAI Model Trainer initialized")
        logger.info(f"📂 Model directory: {self.model_dir}")
        
    def build_model(self, model_type, input_shape, output_shape, config=None):
        """
        Build a model based on the specified type
        
        Args:
            model_type (str): Type of model to build (mlp, lstm, cnn, etc.)
            input_shape: Shape of input data
            output_shape: Shape of output data
            config (dict): Additional configuration for the model
            
        Returns:
            The built model
        """
        config = config or {}
        
        logger.info(f"🏗️ Building {model_type.upper()} model")
        
        if model_type.lower() == "mlp":
            self.model = self._build_mlp(input_shape, output_shape, config)
        elif model_type.lower() == "lstm":
            self.model = self._build_lstm(input_shape, output_shape, config)
        elif model_type.lower() == "cnn":
            self.model = self._build_cnn(input_shape, output_shape, config)
        elif model_type.lower() == "transformer":
            self.model = self._build_transformer(input_shape, output_shape, config)
        elif model_type.lower() == "custom":
            if "custom_builder" in config and callable(config["custom_builder"]):
                self.model = config["custom_builder"](input_shape, output_shape)
            else:
                raise ValueError("Custom model requires a custom_builder function")
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
            
        # Compile the model
        loss = config.get("loss", "mse")
        optimizer = config.get("optimizer", "adam")
        metrics = config.get("metrics", ["accuracy"])
        
        if optimizer == "adam":
            lr = config.get("learning_rate", 0.001)
            optimizer = Adam(learning_rate=lr)
            
        self.model.compile(loss=loss, optimizer=optimizer, metrics=metrics)
        self.model.summary()
        
        return self.model
    
    def _build_mlp(self, input_shape, output_shape, config):
        """Build a Multi-Layer Perceptron model"""
        hidden_layers = config.get("hidden_layers", [64, 32])
        activation = config.get("activation", "relu")
        dropout_rate = config.get("dropout_rate", 0.2)
        
        model = Sequential()
        model.add(Input(shape=input_shape))
        
        for units in hidden_layers:
            model.add(Dense(units, activation=activation))
            if dropout_rate > 0:
                model.add(Dropout(dropout_rate))
                
        if isinstance(output_shape, int):
            model.add(Dense(output_shape, activation=config.get("output_activation", "linear")))
        else:
            model.add(Dense(output_shape[0], activation=config.get("output_activation", "linear")))
            
        return model
    
    def _build_lstm(self, input_shape, output_shape, config):
        """Build an LSTM model"""
        lstm_units = config.get("lstm_units", [64, 32])
        dropout_rate = config.get("dropout_rate", 0.2)
        recurrent_dropout = config.get("recurrent_dropout", 0.0)
        
        model = Sequential()
        model.add(Input(shape=input_shape))
        
        for i, units in enumerate(lstm_units):
            return_sequences = i < len(lstm_units) - 1
            model.add(LSTM(units, 
                          return_sequences=return_sequences,
                          dropout=dropout_rate,
                          recurrent_dropout=recurrent_dropout))
                
        if isinstance(output_shape, int):
            model.add(Dense(output_shape, activation=config.get("output_activation", "linear")))
        else:
            model.add(Dense(output_shape[0], activation=config.get("output_activation", "linear")))
            
        return model
    
    def _build_cnn(self, input_shape, output_shape, config):
        """Build a 1D CNN model"""
        filters = config.get("filters", [64, 32])
        kernel_sizes = config.get("kernel_sizes", [3, 3])
        pool_sizes = config.get("pool_sizes", [2, 2])
        activation = config.get("activation", "relu")
        
        model = Sequential()
        model.add(Input(shape=input_shape))
        
        for i, (f, k, p) in enumerate(zip(filters, kernel_sizes, pool_sizes)):
            model.add(Conv1D(filters=f, kernel_size=k, activation=activation, padding='same'))
            model.add(MaxPooling1D(pool_size=p))
            
        model.add(Flatten())
        model.add(Dense(64, activation=activation))
        
        if isinstance(output_shape, int):
            model.add(Dense(output_shape, activation=config.get("output_activation", "linear")))
        else:
            model.add(Dense(output_shape[0], activation=config.get("output_activation", "linear")))
            
        return model
    
    def _build_transformer(self, input_shape, output_shape, config):
        """Build a simple Transformer model"""
        logger.warning("Transformer implementation is simplified. For complex NLP tasks, consider using specialized libraries.")
        
        # This is a simplified transformer implementation
        # For real transformer models, consider using Hugging Face or TensorFlow's Transformer layers
        embed_dim = config.get("embed_dim", 32)
        num_heads = config.get("num_heads", 2)
        ff_dim = config.get("ff_dim", 32)
        
        inputs = Input(shape=input_shape)
        x = inputs
        
        # Add transformer layers
        for _ in range(config.get("num_layers", 2)):
            # Self-attention and normalization would go here in a full implementation
            x = Dense(ff_dim, activation="relu")(x)
            x = Dense(embed_dim)(x)
            
        # Output layer
        if isinstance(output_shape, int):
            outputs = Dense(output_shape, activation=config.get("output_activation", "linear"))(x)
        else:
            outputs = Dense(output_shape[0], activation=config.get("output_activation", "linear"))(x)
            
        return Model(inputs, outputs)
    
    def train(self, x_train, y_train, validation_data=None, epochs=100, batch_size=32, callbacks=None):
        """
        Train the model
        
        Args:
            x_train: Training features
            y_train: Training targets
            validation_data: Tuple of (x_val, y_val) for validation
            epochs: Number of epochs to train
            batch_size: Batch size for training
            callbacks: List of Keras callbacks
            
        Returns:
            Training history
        """
        if self.model is None:
            raise ValueError("Model not built. Call build_model first.")
            
        logger.info(f"🚀 Starting training for {epochs} epochs with batch size {batch_size}")
        
        # Setup default callbacks if none provided
        if callbacks is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            model_path = os.path.join(self.model_dir, f"3rbai_model_{timestamp}.h5")
            
            callbacks = [
                ModelCheckpoint(
                    filepath=model_path,
                    monitor='val_loss' if validation_data else 'loss',
                    save_best_only=True,
                    mode='min',
                    verbose=1
                ),
                EarlyStopping(
                    monitor='val_loss' if validation_data else 'loss',
                    patience=10,
                    restore_best_weights=True,
                    verbose=1
                ),
                TensorBoard(log_dir=f"./logs/3rbai_{timestamp}")
            ]
            
        # Train the model
        self.history = self.model.fit(
            x_train, y_train,
            validation_data=validation_data,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        logger.info("✅ Training completed")
        return self.history
    
    def evaluate(self, x_test, y_test):
        """
        Evaluate the model on test data
        
        Args:
            x_test: Test features
            y_test: Test targets
            
        Returns:
            Evaluation metrics
        """
        if self.model is None:
            raise ValueError("Model not built. Call build_model first.")
            
        logger.info("📊 Evaluating model on test data")
        results = self.model.evaluate(x_test, y_test, verbose=1)
        
        metrics = {}
        for i, metric_name in enumerate(self.model.metrics_names):
            metrics[metric_name] = results[i]
            logger.info(f"{metric_name}: {results[i]:.4f}")
            
        return metrics
    
    def predict(self, x):
        """
        Make predictions with the model
        
        Args:
            x: Input data
            
        Returns:
            Model predictions
        """
        if self.model is None:
            raise ValueError("Model not built. Call build_model first.")
            
        logger.info("🔮 Making predictions")
        return self.model.predict(x)
    
    def save_model(self, filepath=None):
        """
        Save the model to disk
        
        Args:
            filepath: Path to save the model
            
        Returns:
            Path where model was saved
        """
        if self.model is None:
            raise ValueError("No model to save. Call build_model first.")
            
        if filepath is None:
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            filepath = os.path.join(self.model_dir, f"3rbai_model_{timestamp}.h5")
            
        logger.info(f"💾 Saving model to {filepath}")
        self.model.save(filepath)
        
        # Save model configuration
        config_path = filepath.replace(".h5", "_config.json")
        with open(config_path, 'w') as f:
            json.dump(self.config, f)
            
        return filepath
    
    def load_model(self, filepath):
        """
        Load a model from disk
        
        Args:
            filepath: Path to the saved model
            
        Returns:
            The loaded model
        """
        logger.info(f"📂 Loading model from {filepath}")
        self.model = load_model(filepath)
        
        # Load configuration if available
        config_path = filepath.replace(".h5", "_config.json")
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                self.config = json.load(f)
                
        return self.model
    
    def plot_history(self, save_path=None):
        """
        Plot training history
        
        Args:
            save_path: Path to save the plot
            
        Returns:
            None
        """
        if self.history is None:
            raise ValueError("No training history available. Train the model first.")
            
        logger.info("📈 Plotting training history")
        
        plt.figure(figsize=(12, 5))
        
        # Plot training & validation loss
        plt.subplot(1, 2, 1)
        plt.plot(self.history.history['loss'])
        if 'val_loss' in self.history.history:
            plt.plot(self.history.history['val_loss'])
        plt.title('Model Loss')
        plt.ylabel('Loss')
        plt.xlabel('Epoch')
        plt.legend(['Train', 'Validation'], loc='upper right')
        
        # Plot training & validation accuracy if available
        if 'accuracy' in self.history.history:
            plt.subplot(1, 2, 2)
            plt.plot(self.history.history['accuracy'])
            if 'val_accuracy' in self.history.history:
                plt.plot(self.history.history['val_accuracy'])
            plt.title('Model Accuracy')
            plt.ylabel('Accuracy')
            plt.xlabel('Epoch')
            plt.legend(['Train', 'Validation'], loc='lower right')
            
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path)
            logger.info(f"📊 Plot saved to {save_path}")
        else:
            plt.show()


# Example usage
if __name__ == "__main__":
    logger.info("🧪 Running 3RBAI Model Trainer example")
    
    # Generate some dummy data
    np.random.seed(42)
    x_train = np.random.random((1000, 10))
    y_train = np.random.randint(0, 2, (1000, 1))
    x_val = np.random.random((200, 10))
    y_val = np.random.randint(0, 2, (200, 1))
    x_test = np.random.random((200, 10))
    y_test = np.random.randint(0, 2, (200, 1))
    
    # Create trainer and build model
    trainer = ModelTrainer({
        "name": "3RBAI-Demo",
        "description": "Demo model for 3RBAI system"
    })
    
    # Build and train MLP model
    trainer.build_model(
        model_type="mlp",
        input_shape=(10,),
        output_shape=1,
        config={
            "hidden_layers": [64, 32, 16],
            "activation": "relu",
            "dropout_rate": 0.2,
            "output_activation": "sigmoid",
            "loss": "binary_crossentropy",
            "metrics": ["accuracy"]
        }
    )
    
    # Train the model
    trainer.train(
        x_train=x_train,
        y_train=y_train,
        validation_data=(x_val, y_val),
        epochs=20,
        batch_size=32
    )
    
    # Evaluate the model
    metrics = trainer.evaluate(x_test, y_test)
    
    # Save the model
    model_path = trainer.save_model()
    
    # Plot training history
    trainer.plot_history(save_path="3rbai_training_history.png")
    
    logger.info(f"✅ Example completed. Model saved to {model_path}")
    logger.info(f"📊 Test metrics: {metrics}")
