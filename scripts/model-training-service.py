import os
import sys
import json
import numpy as np
import tensorflow as tf
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import logging
from datetime import datetime
import subprocess
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("3RBAI-ModelTrainingService")

class ModelTrainingService:
    """
    3RBAI Model Training Service
    
    A comprehensive service for training various types of models:
    - Deep Learning (TensorFlow/PyTorch)
    - Machine Learning (scikit-learn)
    - NLP Models (Transformers)
    - Computer Vision Models
    """
    
    def __init__(self):
        """Initialize the model training service"""
        self.models_dir = os.path.join(os.getcwd(), "models")
        os.makedirs(self.models_dir, exist_ok=True)
        
        self.logs_dir = os.path.join(os.getcwd(), "logs")
        os.makedirs(self.logs_dir, exist_ok=True)
        
        logger.info("🚀 3RBAI Model Training Service initialized")
        logger.info(f"📂 Models directory: {self.models_dir}")
        logger.info(f"📊 Logs directory: {self.logs_dir}")
        
    def train_model(self, config_path):
        """
        Train a model based on the provided configuration
        
        Args:
            config_path: Path to the JSON configuration file
            
        Returns:
            dict: Training results
        """
        try:
            # Load configuration
            with open(config_path, 'r') as f:
                config = json.load(f)
                
            logger.info(f"📋 Loaded configuration from {config_path}")
            
            # Validate configuration
            self._validate_config(config)
            
            # Select appropriate training method based on model type
            model_type = config.get("model_type", "").lower()
            
            if model_type in ["tensorflow", "keras", "tf"]:
                return self._train_tensorflow_model(config)
            elif model_type in ["pytorch", "torch", "pt"]:
                return self._train_pytorch_model(config)
            elif model_type in ["transformers", "huggingface", "hf"]:
                return self._train_transformers_model(config)
            elif model_type in ["sklearn", "scikit-learn"]:
                return self._train_sklearn_model(config)
            else:
                raise ValueError(f"Unsupported model type: {model_type}")
                
        except Exception as e:
            logger.error(f"❌ Error training model: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _validate_config(self, config):
        """
        Validate the training configuration
        
        Args:
            config: Configuration dictionary
            
        Raises:
            ValueError: If configuration is invalid
        """
        required_fields = ["model_type", "model_name", "data_config"]
        
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing required configuration field: {field}")
                
        # Validate data configuration
        data_config = config.get("data_config", {})
        if not data_config.get("data_path") and not data_config.get("generate_data"):
            raise ValueError("Either data_path or generate_data must be specified in data_config")
            
        logger.info("✅ Configuration validated successfully")
    
    def _train_tensorflow_model(self, config):
        """
        Train a TensorFlow/Keras model
        
        Args:
            config: Configuration dictionary
            
        Returns:
            dict: Training results
        """
        logger.info("🧠 Training TensorFlow/Keras model")
        
        # Extract configuration
        model_name = config.get("model_name")
        model_config = config.get("model_config", {})
        training_config = config.get("training_config", {})
        data_config = config.get("data_config", {})
        
        # Prepare data
        x_train, y_train, x_val, y_val, x_test, y_test = self._prepare_data(data_config)
        
        # Build model
        model_architecture = model_config.get("architecture", "mlp")
        input_shape = x_train.shape[1:]
        output_shape = y_train.shape[1] if len(y_train.shape) > 1 else 1
        
        if model_architecture == "mlp":
            model = self._build_tf_mlp(input_shape, output_shape, model_config)
        elif model_architecture == "cnn":
            model = self._build_tf_cnn(input_shape, output_shape, model_config)
        elif model_architecture == "lstm":
            model = self._build_tf_lstm(input_shape, output_shape, model_config)
        else:
            raise ValueError(f"Unsupported TensorFlow architecture: {model_architecture}")
            
        # Compile model
        loss = model_config.get("loss", "mse")
        optimizer_name = model_config.get("optimizer", "adam")
        learning_rate = model_config.get("learning_rate", 0.001)
        
        if optimizer_name == "adam":
            optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
        elif optimizer_name == "sgd":
            optimizer = tf.keras.optimizers.SGD(learning_rate=learning_rate)
        else:
            optimizer = optimizer_name
            
        metrics = model_config.get("metrics", ["accuracy"])
        model.compile(loss=loss, optimizer=optimizer, metrics=metrics)
        
        # Setup callbacks
        callbacks = []
        
        # Model checkpoint
        model_path = os.path.join(self.models_dir, f"{model_name}.h5")
        callbacks.append(tf.keras.callbacks.ModelCheckpoint(
            filepath=model_path,
            monitor='val_loss',
            save_best_only=True,
            mode='min',
            verbose=1
        ))
        
        # Early stopping
        if training_config.get("early_stopping", True):
            callbacks.append(tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=training_config.get("patience", 10),
                restore_best_weights=True,
                verbose=1
            ))
            
        # TensorBoard
        log_dir = os.path.join(self.logs_dir, f"{model_name}_{datetime.now().strftime('%Y%m%d-%H%M%S')}")
        callbacks.append(tf.keras.callbacks.TensorBoard(log_dir=log_dir))
        
        # Train model
        epochs = training_config.get("epochs", 100)
        batch_size = training_config.get("batch_size", 32)
        
        history = model.fit(
            x_train, y_train,
            validation_data=(x_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate model
        test_results = model.evaluate(x_test, y_test, verbose=1)
        metrics_dict = {}
        for i, metric_name in enumerate(model.metrics_names):
            metrics_dict[metric_name] = float(test_results[i])
            
        # Save training history
        history_path = os.path.join(self.models_dir, f"{model_name}_history.json")
        with open(history_path, 'w') as f:
            history_dict = {}
            for key, value in history.history.items():
                history_dict[key] = [float(v) for v in value]
            json.dump(history_dict, f)
            
        # Plot training history
        self._plot_training_history(history.history, model_name)
        
        logger.info(f"✅ TensorFlow model training completed: {model_name}")
        
        return {
            "success": True,
            "model_path": model_path,
            "history_path": history_path,
            "metrics": metrics_dict,
            "model_type": "tensorflow"
        }
    
    def _train_pytorch_model(self, config):
        """
        Train a PyTorch model
        
        Args:
            config: Configuration dictionary
            
        Returns:
            dict: Training results
        """
        logger.info("🔥 Training PyTorch model")
        
        # Extract configuration
        model_name = config.get("model_name")
        model_config = config.get("model_config", {})
        training_config = config.get("training_config", {})
        data_config = config.get("data_config", {})
        
        # Prepare data
        x_train, y_train, x_val, y_val, x_test, y_test = self._prepare_data(data_config)
        
        # Convert to PyTorch tensors
        x_train_tensor = torch.FloatTensor(x_train)
        y_train_tensor = torch.FloatTensor(y_train)
        x_val_tensor = torch.FloatTensor(x_val)
        y_val_tensor = torch.FloatTensor(y_val)
        x_test_tensor = torch.FloatTensor(x_test)
        y_test_tensor = torch.FloatTensor(y_test)
        
        # Create data loaders
        batch_size = training_config.get("batch_size", 32)
        train_dataset = TensorDataset(x_train_tensor, y_train_tensor)
        val_dataset = TensorDataset(x_val_tensor, y_val_tensor)
        test_dataset = TensorDataset(x_test_tensor, y_test_tensor)
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size)
        test_loader = DataLoader(test_dataset, batch_size=batch_size)
        
        # Build model
        model_architecture = model_config.get("architecture", "mlp")
        input_shape = x_train.shape[1]
        output_shape = y_train.shape[1] if len(y_train.shape) > 1 else 1
        
        if model_architecture == "mlp":
            model = self._build_pt_mlp(input_shape, output_shape, model_config)
        elif model_architecture == "cnn":
            model = self._build_pt_cnn(input_shape, output_shape, model_config)
        elif model_architecture == "lstm":
            model = self._build_pt_lstm(input_shape, output_shape, model_config)
        else:
            raise ValueError(f"Unsupported PyTorch architecture: {model_architecture}")
            
        # Setup loss and optimizer
        loss_name = model_config.get("loss", "mse")
        if loss_name == "mse":
            criterion = nn.MSELoss()
        elif loss_name == "cross_entropy":
            criterion = nn.CrossEntropyLoss()
        elif loss_name == "bce":
            criterion = nn.BCELoss()
        else:
            raise ValueError(f"Unsupported loss function: {loss_name}")
            
        optimizer_name = model_config.get("optimizer", "adam")
        learning_rate = model_config.get("learning_rate", 0.001)
        
        if optimizer_name == "adam":
            optimizer = optim.Adam(model.parameters(), lr=learning_rate)
        elif optimizer_name == "sgd":
            optimizer = optim.SGD(model.parameters(), lr=learning_rate)
        else:
            raise ValueError(f"Unsupported optimizer: {optimizer_name}")
            
        # Training loop
        epochs = training_config.get("epochs", 100)
        patience = training_config.get("patience", 10)
        
        best_val_loss = float('inf')
        patience_counter = 0
        history = {
            "train_loss": [],
            "val_loss": []
        }
        
        for epoch in range(epochs):
            # Training
            model.train()
            train_loss = 0.0
            for inputs, targets in train_loader:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
                
            train_loss /= len(train_loader)
            history["train_loss"].append(train_loss)
            
            # Validation
            model.eval()
            val_loss = 0.0
            with torch.no_grad():
                for inputs, targets in val_loader:
                    outputs = model(inputs)
                    loss = criterion(outputs, targets)
                    val_loss += loss.item()
                    
            val_loss /= len(val_loader)
            history["val_loss"].append(val_loss)
            
            logger.info(f"Epoch {epoch+1}/{epochs} - Train Loss: {train_loss:.4f} - Val Loss: {val_loss:.4f}")
            
            # Check for early stopping
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                
                # Save best model
                model_path = os.path.join(self.models_dir, f"{model_name}.pt")
                torch.save(model.state_dict(), model_path)
            else:
                patience_counter += 1
                
            if patience_counter >= patience:
                logger.info(f"Early stopping at epoch {epoch+1}")
                break
                
        # Evaluate model
        model.eval()
        test_loss = 0.0
        with torch.no_grad():
            for inputs, targets in test_loader:
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                test_loss += loss.item()
                
        test_loss /= len(test_loader)
        
        # Save training history
        history_path = os.path.join(self.models_dir, f"{model_name}_history.json")
        with open(history_path, 'w') as f:
            json.dump(history, f)
            
        # Plot training history
        self._plot_training_history(history, model_name)
        
        logger.info(f"✅ PyTorch model training completed: {model_name}")
        
        return {
            "success": True,
            "model_path": model_path,
            "history_path": history_path,
            "metrics": {"test_loss": test_loss},
            "model_type": "pytorch"
        }
    
    def _train_transformers_model(self, config):
        """
        Train a Hugging Face Transformers model
        
        Args:
            config: Configuration dictionary
            
        Returns:
            dict: Training results
        """
        logger.info("🤗 Training Transformers model")
        
        try:
            # Check if transformers is installed
            import importlib
            if importlib.util.find_spec("transformers") is None:
                logger.error("❌ Transformers library not found. Please install it with: pip install transformers")
                return {
                    "success": False,
                    "error": "Transformers library not installed"
                }
                
            # Import required libraries
            from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
            from datasets import Dataset
            
            # Extract configuration
            model_name = config.get("model_name")
            model_config = config.get("model_config", {})
            training_config = config.get("training_config", {})
            data_config = config.get("data_config", {})
            
            # Get pretrained model name
            pretrained_model = model_config.get("pretrained_model", "bert-base-uncased")
            
            # Load tokenizer and model
            tokenizer = AutoTokenizer.from_pretrained(pretrained_model)
            model = AutoModelForSequenceClassification.from_pretrained(
                pretrained_model, 
                num_labels=model_config.get("num_labels", 2)
            )
            
            # Load data
            data_path = data_config.get("data_path")
            if not data_path:
                raise ValueError("data_path is required for transformers models")
                
            with open(data_path, 'r') as f:
                data = json.load(f)
                
            # Prepare datasets
            train_dataset = Dataset.from_dict({
                "text": data["train"]["texts"],
                "label": data["train"]["labels"]
            })
            
            val_dataset = Dataset.from_dict({
                "text": data["validation"]["texts"],
                "label": data["validation"]["labels"]
            })
            
            # Tokenize function
            def tokenize_function(examples):
                return tokenizer(
                    examples["text"], 
                    padding="max_length", 
                    truncation=True, 
                    max_length=model_config.get("max_length", 128)
                )
                
            # Tokenize datasets
            train_dataset = train_dataset.map(tokenize_function, batched=True)
            val_dataset = val_dataset.map(tokenize_function, batched=True)
            
            # Setup training arguments
            output_dir = os.path.join(self.models_dir, model_name)
            
            training_args = TrainingArguments(
                output_dir=output_dir,
                num_train_epochs=training_config.get("epochs", 3),
                per_device_train_batch_size=training_config.get("batch_size", 8),
                per_device_eval_batch_size=training_config.get("batch_size", 8),
                warmup_steps=training_config.get("warmup_steps", 500),
                weight_decay=training_config.get("weight_decay", 0.01),
                logging_dir=os.path.join(self.logs_dir, f"{model_name}_logs"),
                logging_steps=training_config.get("logging_steps", 100),
                evaluation_strategy="epoch",
                save_strategy="epoch",
                load_best_model_at_end=True,
            )
            
            # Initialize trainer
            trainer = Trainer(
                model=model,
                args=training_args,
                train_dataset=train_dataset,
                eval_dataset=val_dataset,
            )
            
            # Train model
            trainer.train()
            
            # Evaluate model
            eval_results = trainer.evaluate()
            
            # Save model
            trainer.save_model(output_dir)
            tokenizer.save_pretrained(output_dir)
            
            logger.info(f"✅ Transformers model training completed: {model_name}")
            
            return {
                "success": True,
                "model_path": output_dir,
                "metrics": eval_results,
                "model_type": "transformers"
            }
            
        except Exception as e:
            logger.error(f"❌ Error training transformers model: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _train_sklearn_model(self, config):
        """
        Train a scikit-learn model
        
        Args:
            config: Configuration dictionary
            
        Returns:
            dict: Training results
        """
        logger.info("🔬 Training scikit-learn model")
        
        try:
            # Check if scikit-learn is installed
            import importlib
            if importlib.util.find_spec("sklearn") is None:
                logger.error("❌ scikit-learn library not found. Please install it with: pip install scikit-learn")
                return {
                    "success": False,
                    "error": "scikit-learn library not installed"
                }
                
            # Import required libraries
            from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
            from sklearn.linear_model import LogisticRegression
            from sklearn.svm import SVC
            from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
            import joblib
            
            # Extract configuration
            model_name = config.get("model_name")
            model_config = config.get("model_config", {})
            data_config = config.get("data_config", {})
            
            # Prepare data
            x_train, y_train, x_val, y_val, x_test, y_test = self._prepare_data(data_config)
            
            # Flatten y if needed
            if len(y_train.shape) > 1 and y_train.shape[1] == 1:
                y_train = y_train.ravel()
                y_val = y_val.ravel()
                y_test = y_test.ravel()
                
            # Build model
            algorithm = model_config.get("algorithm", "random_forest")
            
            if algorithm == "random_forest":
                model = RandomForestClassifier(
                    n_estimators=model_config.get("n_estimators", 100),
                    max_depth=model_config.get("max_depth", None),
                    random_state=42
                )
            elif algorithm == "gradient_boosting":
                model = GradientBoostingClassifier(
                    n_estimators=model_config.get("n_estimators", 100),
                    learning_rate=model_config.get("learning_rate", 0.1),
                    max_depth=model_config.get("max_depth", 3),
                    random_state=42
                )
            elif algorithm == "logistic_regression":
                model = LogisticRegression(
                    C=model_config.get("C", 1.0),
                    max_iter=model_config.get("max_iter", 100),
                    random_state=42
                )
            elif algorithm == "svm":
                model = SVC(
                    C=model_config.get("C", 1.0),
                    kernel=model_config.get("kernel", "rbf"),
                    probability=True,
                    random_state=42
                )
            else:
                raise ValueError(f"Unsupported scikit-learn algorithm: {algorithm}")
                
            # Train model
            model.fit(x_train, y_train)
            
            # Evaluate model
            y_pred = model.predict(x_test)
            
            metrics = {
                "accuracy": float(accuracy_score(y_test, y_pred)),
                "precision": float(precision_score(y_test, y_pred, average="weighted")),
                "recall": float(recall_score(y_test, y_pred, average="weighted")),
                "f1": float(f1_score(y_test, y_pred, average="weighted"))
            }
            
            # Save model
            model_path = os.path.join(self.models_dir, f"{model_name}.joblib")
            joblib.dump(model, model_path)
            
            logger.info(f"✅ scikit-learn model training completed: {model_name}")
            
            return {
                "success": True,
                "model_path": model_path,
                "metrics": metrics,
                "model_type": "sklearn"
            }
            
        except Exception as e:
            logger.error(f"❌ Error training scikit-learn model: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _prepare_data(self, data_config):
        """
        Prepare data for training
        
        Args:
            data_config: Data configuration dictionary
            
        Returns:
            tuple: (x_train, y_train, x_val, y_val, x_test, y_test)
        """
        # Check if we should generate synthetic data
        if data_config.get("generate_data", False):
            return self._generate_synthetic_data(data_config)
            
        # Load data from file
        data_path = data_config.get("data_path")
        if not data_path:
            raise ValueError("data_path is required when generate_data is False")
            
        # Load data based on file type
        file_ext = os.path.splitext(data_path)[1].lower()
        
        if file_ext == ".csv":
            import pandas as pd
            df = pd.read_csv(data_path)
        elif file_ext == ".json":
            import pandas as pd
            df = pd.read_json(data_path)
        elif file_ext in [".npy", ".npz"]:
            data = np.load(data_path)
            if file_ext == ".npz":
                x = data["x"]
                y = data["y"]
            else:
                # Assume the first 80% of the data is x and the rest is y
                split_idx = int(data.shape[0] * 0.8)
                x = data[:split_idx]
                y = data[split_idx:]
        else:
            raise ValueError(f"Unsupported data file format: {file_ext}")
            
        # If we loaded a DataFrame, extract features and target
        if "df" in locals():
            target_column = data_config.get("target_column")
            if not target_column:
                raise ValueError("target_column is required for CSV/JSON data")
                
            feature_columns = data_config.get("feature_columns")
            if not feature_columns:
                # Use all columns except target as features
                feature_columns = [col for col in df.columns if col != target_column]
                
            x = df[feature_columns].values
            y = df[target_column].values
            
        # Split data
        test_size = data_config.get("test_size", 0.2)
        val_size = data_config.get("val_size", 0.2)
        
        # First split: training + validation vs test
        x_train_val, x_test, y_train_val, y_test = train_test_split(
            x, y, test_size=test_size, random_state=42
        )
        
        # Second split: training vs validation
        # Adjust validation size to account for the test split
        adjusted_val_size = val_size / (1 - test_size)
        x_train, x_val, y_train, y_val = train_test_split(
            x_train_val, y_train_val, test_size=adjusted_val_size, random_state=42
        )
        
        # Normalize data if specified
        if data_config.get("normalize", True):
            scaler = StandardScaler()
            x_train = scaler.fit_transform(x_train)
            x_val = scaler.transform(x_val)
            x_test = scaler.transform(x_test)
            
        # Reshape data if needed for specific model types
        if data_config.get("reshape_for_lstm", False):
            # Reshape for LSTM: (samples, timesteps, features)
            timesteps = data_config.get("timesteps", 10)
            x_train = x_train.reshape(x_train.shape[0], timesteps, -1)
            x_val = x_val.reshape(x_val.shape[0], timesteps, -1)
            x_test = x_test.reshape(x_test.shape[0], timesteps, -1)
            
        # Reshape y if needed
        if data_config.get("one_hot_encode_target", False):
            from tensorflow.keras.utils import to_categorical
            num_classes = data_config.get("num_classes")
            if not num_classes:
                num_classes = len(np.unique(y))
                
            y_train = to_categorical(y_train, num_classes=num_classes)
            y_val = to_categorical(y_val, num_classes=num_classes)
            y_test = to_categorical(y_test, num_classes=num_classes)
            
        return x_train, y_train, x_val, y_val, x_test, y_test
    
    def _generate_synthetic_data(self, data_config):
        """
        Generate synthetic data for training
        
        Args:
            data_config: Data configuration dictionary
            
        Returns:
            tuple: (x_train, y_train, x_val, y_val, x_test, y_test)
        """
        logger.info("🧪 Generating synthetic data")
        
        # Get data dimensions
        num_samples = data_config.get("num_samples", 1000)
        num_features = data_config.get("num_features", 10)
        num_classes = data_config.get("num_classes", 2)
        
        # Generate features
        x = np.random.randn(num_samples, num_features)
        
        # Generate target
        if data_config.get("problem_type") == "regression":
            # Simple linear relationship with noise
            weights = np.random.randn(num_features)
            y = np.dot(x, weights) + np.random.randn(num_samples) * 0.1
            y = y.reshape(-1, 1)  # Reshape for consistency
        else:
            # Classification
            if num_classes == 2:
                # Binary classification
                weights = np.random.randn(num_features)
                logits = np.dot(x, weights)
                y = (logits > 0).astype(int)
            else:
                # Multi-class classification
                y = np.random.randint(0, num_classes, size=num_samples)
                
                # One-hot encode if specified
                if data_config.get("one_hot_encode_target", False):
                    from tensorflow.keras.utils import to_categorical
                    y = to_categorical(y, num_classes=num_classes)
                    
        # Split data
        test_size = data_config.get("test_size", 0.2)
        val_size = data_config.get("val_size", 0.2)
        
        # First split: training + validation vs test
        x_train_val, x_test, y_train_val, y_test = train_test_split(
            x, y, test_size=test_size, random_state=42
        )
        
        # Second split: training vs validation
        # Adjust validation size to account for the test split
        adjusted_val_size = val_size / (1 - test_size)
        x_train, x_val, y_train, y_val = train_test_split(
            x_train_val, y_train_val, test_size=adjusted_val_size, random_state=42
        )
        
        # Reshape data if needed for specific model types
        if data_config.get("reshape_for_lstm", False):
            # Reshape for LSTM: (samples, timesteps, features)
            timesteps = data_config.get("timesteps", 10)
            features_per_timestep = num_features // timesteps
            
            x_train = x_train.reshape(x_train.shape[0], timesteps, features_per_timestep)
            x_val = x_val.reshape(x_val.shape[0], timesteps, features_per_timestep)
            x_test = x_test.reshape(x_test.shape[0], timesteps, features_per_
