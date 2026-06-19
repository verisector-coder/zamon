# ZAMON — Apple Premium Store (Таджикистан)

Премиальный многостраничный сайт-витрина авторизованного магазина техники Apple в Таджикистане.
iPhone, Mac, iPad, Apple Watch, AirPods — линейки моделей, конфигуратор покупки, Trade-In, кредит 0%.

## Стек
Чистый статический сайт: HTML + CSS + JS, **без сборки и без бэкенда**.
- `zamon.css` — дизайн-система, шапка, футер, все страницы
- `zamon.js` — данные товаров, i18n (RU/TJ/EN), тема (light/dark), корзина, конфигуратор, рендер
- Тонкие HTML-страницы подключают `zamon.css?v=N` и `zamon.js?v=N`

## Локальный запуск
```
python -m http.server 8099
```
Открыть http://localhost:8099/index.html

## Обновление (кэш)
CSS/JS подключены как `?v=N`. При любой правке `zamon.css`/`zamon.js` нужно увеличить `N` во всех HTML
**байт-безопасным** скриптом (UTF-8 без BOM), иначе ломается кириллица:
```python
import glob, re
V = "40"
for p in glob.glob("*.html"):
    s = open(p, "rb").read().decode("utf-8")
    s = re.sub(r"zamon\.(css|js)\?v=\d+", lambda m: "zamon." + m.group(1) + "?v=" + V, s)
    open(p, "wb").write(s.encode("utf-8"))
```

## Примечания
- Изображения и видео берутся с CDN Apple (для демо/портфолио).
- Корзина/заказы/аккаунт — имитация на `localStorage` (без реальных оплат).
