FROM oven/bun
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
EXPOSE 5173
ENTRYPOINT [ "bun", "run", "dev", "--host" ]