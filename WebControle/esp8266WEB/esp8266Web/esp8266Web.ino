#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// Credenciais Wi-Fi
const char* ssid = "LABORATORIO-UFLA";
const char* password = "@Ufla030122";

// Configuração do servidor web
ESP8266WebServer server(80);

// Variáveis do sensor
volatile int pulseCount = 0;
float flowRate = 0.0;

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void calculateFlowRate() {
  noInterrupts();  // Evita alterações enquanto calculamos
  flowRate = pulseCount / 7.5;  // Ajuste conforme o sensor
  pulseCount = 0;
  interrupts();
}

// Função para lidar com a rota "/dados" e incluir o cabeçalho de CORS
void handleSensorData() {
  calculateFlowRate();
  String jsonData = "{\"fluxo\":" + String(flowRate) + "}";

  // Criando uma resposta com cabeçalho adicional    
  ]

  r
  server.sendHeader("Access-Control-Allow-Origin", "*"); // Permitir todas as origens
  server.send(200, "application/json", jsonData);
}

void setup() {
  Serial.begin(115200);
  
  // Configuração do sensor
  pinMode(D5, INPUT);
  attachInterrupt(digitalPinToInterrupt(D5), pulseCounter, FALLING);

  // Conexão Wi-Fi
  WiFi.begin(ssid, password);
  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 20) {  // Timeout de 20 segundos
    delay(1000);
    Serial.println("Conectando...");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Conexão Wi-Fi estabelecida!");
    Serial.println("IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("Falha ao conectar no Wi-Fi.");
  }

  // Configuração do servidor
  server.on("/dados", handleSensorData);
  server.begin();
}

void loop() {
  server.handleClient();
}

