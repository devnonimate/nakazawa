import sqlite3

# Conectando ao banco de dados
conn = sqlite3.connect('seu_banco_de_dados.db')

# Nome da tabela que você quer inspecionar
tabela = 'sua_tabela'

# Executando o PRAGMA para obter informações sobre as colunas
cursor = conn.cursor()
cursor.execute(f"PRAGMA table_info({tabela})")
colunas = cursor.fetchall()

# Exibindo informações sobre as colunas
print("Colunas da tabela:")
for coluna in colunas:
    print(f"Nome: {coluna[1]}, Tipo: {coluna[2]}, NotNull: {bool(coluna[3])}, PK: {bool(coluna[5])}")

# Fechando a conexão
conn.close()
