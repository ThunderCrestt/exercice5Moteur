"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.NetWorkScore = exports.NetWorkScoreChanged = exports.NetworkInputChanged = exports.NetworkStart = exports.NetworkLogin = exports.NetworkMessage = void 0;
var typeMap = {};
// # Classe *NetworkMessage*
// Cette classe est une classe de base pour l'ensemble des
// messages réseau.
var NetworkMessage = /** @class */ (function () {
    function NetworkMessage() {
    }
    // ## Méthode statique *register*
    // Cette méthode statique permet d'enregistrer la correspondance
    // entre les codes de type et les classes de messages.
    NetworkMessage.register = function (klass) {
        typeMap[klass.typeCode] = klass;
    };
    // ## Fonction statique *create*
    // La fonction *create* crée une instance de la bonne classe
    // de message à partir de son code de type, et remplit les
    // valeurs avec les données reçues.
    NetworkMessage.create = function (deserializer) {
        var typeCode = deserializer.peekU8();
        if (!typeMap[typeCode]) {
            return null;
        }
        var msg = new typeMap[typeCode]();
        msg.deserialize(deserializer);
        return msg;
    };
    // ## Méthode *serialize*
    // Cette méthode, à surcharger dans les classes enfant,
    // permet d'enregistrer le contenu du message dans un
    // format pouvant être transféré.
    NetworkMessage.prototype.serialize = function (serializer) {
        serializer.writeU8(this.typeCode);
    };
    // ## Méthode *deserialize*
    // Cette méthode, à surcharger dans les classes enfant,
    // permet de reconstituer le contenu du message à partir
    // des données reçues.
    NetworkMessage.prototype.deserialize = function (deserializer) {
        this.typeCode = deserializer.readU8();
    };
    return NetworkMessage;
}());
exports.NetworkMessage = NetworkMessage;
// # Classe *NetworkLogin*
// Ce message permet de transférer les informations nécessaires
// lors de la connexion d'un joueur.
var NetworkLogin = /** @class */ (function (_super) {
    __extends(NetworkLogin, _super);
    function NetworkLogin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // ## Méthode *build*
    // Initialise les valeurs lors de la création d'une nouvelle
    // instance de ce message.
    NetworkLogin.prototype.build = function (msg) {
        this.typeCode = NetworkLogin.typeCode;
        this.name = msg.name;
    };
    // ## Méthode *serialize*
    // Cette méthode permet d'enregistrer le contenu du message
    // dans un format pouvant être transféré.
    NetworkLogin.prototype.serialize = function (serializer) {
        _super.prototype.serialize.call(this, serializer);
        serializer.writeString(this.name);
    };
    // ## Méthode *deserialize*
    // Cette méthode permet de reconstituer le contenu du message
    // à partir des données reçues.
    NetworkLogin.prototype.deserialize = function (deserializer) {
        _super.prototype.deserialize.call(this, deserializer);
        this.name = deserializer.readString();
    };
    // ## Constante *typeCode*
    // Représente l'identifiant numérique de ce message
    NetworkLogin.typeCode = 1;
    return NetworkLogin;
}(NetworkMessage));
exports.NetworkLogin = NetworkLogin;
// # Classe *NetworkStart*
// Ce message permet indique aux clients que la partie est prête
// à commencer. On y stocke la liste des joueurs et le numéro du joueur.
var NetworkStart = /** @class */ (function (_super) {
    __extends(NetworkStart, _super);
    function NetworkStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // ## Méthode *build*
    // Initialise les valeurs lors de la création d'une nouvelle
    // instance de ce message.
    NetworkStart.prototype.build = function (msg) {
        this.typeCode = NetworkStart.typeCode;
        this.playerIndex = msg.playerIndex;
        this.names = msg.names;
    };
    // ## Méthode *serialize*
    // Cette méthode permet d'enregistrer le contenu du message
    // dans un format pouvant être transféré.
    NetworkStart.prototype.serialize = function (serializer) {
        _super.prototype.serialize.call(this, serializer);
        serializer.writeU8(this.playerIndex);
        serializer.writeU8(this.names.length);
        this.names.forEach(function (n) {
            serializer.writeString(n);
        });
    };
    // ## Méthode *deserialize*
    // Cette méthode permet de reconstituer le contenu du message
    // à partir des données reçues.
    NetworkStart.prototype.deserialize = function (deserializer) {
        _super.prototype.deserialize.call(this, deserializer);
        this.playerIndex = deserializer.readU8();
        var nbNames = deserializer.readU8();
        this.names = [];
        for (var i = 0; i < nbNames; ++i) {
            this.names.push(deserializer.readString());
        }
    };
    // ## Constante *typeCode*
    // Représente l'identifiant numérique de ce message
    NetworkStart.typeCode = 2;
    return NetworkStart;
}(NetworkMessage));
exports.NetworkStart = NetworkStart;
// # Classe *NetworkInputChanged*
// Ce message représente un changement dans les entrées du joueur.
var NetworkInputChanged = /** @class */ (function (_super) {
    __extends(NetworkInputChanged, _super);
    function NetworkInputChanged() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // ## Méthode *build*
    // Initialise les valeurs lors de la création d'une nouvelle
    // instance de ce message.
    NetworkInputChanged.prototype.build = function (symbols) {
        this.typeCode = NetworkInputChanged.typeCode;
        this.symbols = symbols;
    };
    // ## Méthode *serialize*
    // Cette méthode permet d'enregistrer le contenu du message
    // dans un format pouvant être transféré.
    NetworkInputChanged.prototype.serialize = function (serializer) {
        var _this = this;
        _super.prototype.serialize.call(this, serializer);
        var count = Object.keys(this.symbols).length;
        serializer.writeU8(count);
        Object.keys(this.symbols).forEach(function (k) {
            serializer.writeString(k);
            serializer.writeU8(_this.symbols[k] ? 1 : 0);
        });
    };
    // ## Méthode *deserialize*
    // Cette méthode permet de reconstituer le contenu du message
    // à partir des données reçues.
    NetworkInputChanged.prototype.deserialize = function (deserializer) {
        _super.prototype.deserialize.call(this, deserializer);
        var count = deserializer.readU8();
        this.symbols = {};
        for (var i = 0; i < count; ++i) {
            var k = deserializer.readString();
            var v = deserializer.readU8();
            this.symbols[k] = (v !== 0);
        }
    };
    // ## Constante *typeCode*
    // Représente l'identifiant numérique de ce message
    NetworkInputChanged.typeCode = 100;
    return NetworkInputChanged;
}(NetworkMessage));
exports.NetworkInputChanged = NetworkInputChanged;
var NetWorkScoreChanged = /** @class */ (function (_super) {
    __extends(NetWorkScoreChanged, _super);
    function NetWorkScoreChanged() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.interfaceScore = {};
        return _this;
    }
    // ## Méthode *build*
    // Initialise les valeurs lors de la création d'une nouvelle
    // instance de ce message.
    NetWorkScoreChanged.prototype.build = function (input) {
        this.typeCode = NetWorkScoreChanged.typeCode;
        this.interfaceScore = input;
    };
    // ## Méthode *serialize*
    // Cette méthode permet d'enregistrer le contenu du message
    // dans un format pouvant être transféré.
    NetWorkScoreChanged.prototype.serialize = function (serializer) {
        var _this = this;
        _super.prototype.serialize.call(this, serializer);
        var count = Object.keys(this.interfaceScore).length;
        serializer.writeU8(count);
        Object.keys(this.interfaceScore).forEach(function (k) {
            serializer.writeString(k);
            serializer.writeU32(_this.interfaceScore[k] ? _this.interfaceScore[k] : -1);
        });
    };
    // ## Méthode *deserialize*
    // Cette méthode permet de reconstituer le contenu du message
    // à partir des données reçues.
    NetWorkScoreChanged.prototype.deserialize = function (deserializer) {
        _super.prototype.deserialize.call(this, deserializer);
        var count = deserializer.readU8();
        this.interfaceScore = {};
        for (var i = 0; i < count; ++i) {
            var k = deserializer.readString();
            var v = deserializer.readU32();
            if (v !== -1) {
                this.interfaceScore[k] = v;
            }
        }
    };
    // ## Constante *typeCode*
    // Représente l'identifiant numérique de ce message
    NetWorkScoreChanged.typeCode = 3;
    return NetWorkScoreChanged;
}(NetworkMessage));
exports.NetWorkScoreChanged = NetWorkScoreChanged;
var NetWorkScore = /** @class */ (function (_super) {
    __extends(NetWorkScore, _super);
    function NetWorkScore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.interfaceScore = {};
        return _this;
    }
    // ## Méthode *build*
    // Initialise les valeurs lors de la création d'une nouvelle
    // instance de ce message.
    NetWorkScore.prototype.build = function (input) {
        this.typeCode = NetWorkScore.typeCode;
        this.interfaceScore = input;
    };
    // ## Méthode *serialize*
    // Cette méthode permet d'enregistrer le contenu du message
    // dans un format pouvant être transféré.
    NetWorkScore.prototype.serialize = function (serializer) {
        var _this = this;
        _super.prototype.serialize.call(this, serializer);
        var count = Object.keys(this.interfaceScore).length;
        serializer.writeU8(count);
        Object.keys(this.interfaceScore).forEach(function (k) {
            serializer.writeString(k);
            serializer.writeU32(_this.interfaceScore[k] ? _this.interfaceScore[k] : -1);
        });
    };
    // ## Méthode *deserialize*
    // Cette méthode permet de reconstituer le contenu du message
    // à partir des données reçues.
    NetWorkScore.prototype.deserialize = function (deserializer) {
        _super.prototype.deserialize.call(this, deserializer);
        var count = deserializer.readU8();
        this.interfaceScore = {};
        for (var i = 0; i < count; ++i) {
            var k = deserializer.readString();
            var v = deserializer.readU32();
            if (v !== -1) {
                this.interfaceScore[k] = v;
            }
        }
    };
    // ## Constante *typeCode*
    // Représente l'identifiant numérique de ce message
    NetWorkScore.typeCode = 4;
    return NetWorkScore;
}(NetworkMessage));
exports.NetWorkScore = NetWorkScore;
// # Enregistrement des types de message
// Ces instructions sont exécutées lors du chargement de ce
// fichier de script, et permettent d'enregistrer les types
// de message connus.
NetworkMessage.register(NetworkLogin);
NetworkMessage.register(NetworkStart);
NetworkMessage.register(NetworkInputChanged);
NetworkMessage.register(NetWorkScoreChanged);
NetworkMessage.register(NetWorkScore);
